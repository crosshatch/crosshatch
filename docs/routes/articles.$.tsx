// TODO: share button

import { articles } from "@/lib/source"
import { Button } from "@crosshatch/ui/components/Button"
import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

// import { components } from "@/components/mdx"
// import { InlineTOC } from "fumadocs-ui/components/inline-toc"

const loader = createServerFn({ method: "GET" })
  .inputValidator((data: Array<string>) => data)
  .handler(async ({ data }) => {
    const page = articles.getPage(data)
    if (!page) throw notFound()
    const { author, title, description, date } = page.data
    return { author, title, description, date, path: page.path }
  })

export const Route = createFileRoute("/articles/$")({
  loader: async ({ params: { _splat } }) => {
    const slugs = _splat?.split("/") ?? []
    const data = await loader({ data: slugs })
    // await clientLoader.preload(data.path)
    return data
  },
  component: Page,
})

function Page() {
  const post = Route.useLoaderData()
  return (
    <article className="flex flex-col mx-auto w-full max-w-[800px] px-4 py-8">
      <div className="flex flex-row gap-4 text-sm mb-8">
        <div>
          <p className="mb-1 text-fd-muted-foreground">Written by</p>
          <p className="font-medium">{post.author}</p>
        </div>
        <div>
          <p className="mb-1 text-sm text-fd-muted-foreground">At</p>
          <p className="font-medium">
            {new Date(post.date).toDateString()}
          </p>
        </div>
      </div>
      <h1 className="text-3xl font-semibold mb-4">{post.title}</h1>
      <p className="text-fd-muted-foreground mb-8">{post.description}</p>
      <div className="prose min-w-0 flex-1">
        <div className="flex flex-row items-center gap-2 mb-8 not-prose">
          <Button asChild>
            <Link to="/articles">Back</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}

// <Mdx {...components} />
