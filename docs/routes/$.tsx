import { docs } from "@/.source"
import { Feedback } from "@/components/feedback"
import { components } from "@/components/mdx"
import { discordLink, githubLink, layoutPropsCommon, xLink } from "@/lib/layout.shared"
import { source } from "@/lib/source"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import type * as PageTree from "fumadocs-core/page-tree"
import { createClientLoader } from "fumadocs-mdx/runtime/vite"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import { useMemo } from "react"

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    const slugs = params._splat?.split("/") ?? []
    const data = await loader({ data: slugs })
    await clientLoader.preload(data.path)
    return data
  },
  component: Page,
})

const loader = createServerFn({ method: "GET" })
  .inputValidator((slugs: Array<string>) => slugs)
  .handler(async ({ data: slugs }) => {
    const page = source.getPage(slugs)
    if (!page) throw notFound()
    return {
      tree: source.pageTree as object,
      path: page.path,
    }
  })

const clientLoader = createClientLoader(docs.doc, {
  id: "docs",
  component({ toc, frontmatter, default: MDX }) {
    return (
      <DocsPage {...{ toc }} tableOfContent={{ style: "clerk" }}>
        <DocsTitle>{frontmatter.title}</DocsTitle>
        <DocsDescription>{frontmatter.description}</DocsDescription>
        <DocsBody>
          <MDX {...{ components }} />
        </DocsBody>
        <Feedback
          onRateAction={async (url, feedback) => {
            // TODO
            console.log({ url, feedback })
          }}
        />
      </DocsPage>
    )
  },
})

const transformPageTree = (tree: PageTree.Folder): PageTree.Folder => {
  const transform = <T extends PageTree.Item | PageTree.Separator>(item: T) => {
    if (typeof item.icon !== "string") return item
    return {
      ...item,
      icon: (
        <span
          dangerouslySetInnerHTML={{
            __html: item.icon,
          }}
        />
      ),
    }
  }
  return {
    ...tree,
    ...(tree.index ? { index: transform(tree.index) } : {}),
    children: tree.children.map((item) => {
      if (item.type === "folder") return transformPageTree(item)
      return transform(item)
    }),
  }
}

function Page() {
  const data = Route.useLoaderData()
  const Content = clientLoader.getComponent(data.path)
  const tree = useMemo(() => transformPageTree(data.tree as PageTree.Folder), [data.tree])
  return (
    <DocsLayout
      {...layoutPropsCommon}
      tree={tree}
      links={[githubLink, xLink, discordLink]}
    >
      <Content />
    </DocsLayout>
  )
}
