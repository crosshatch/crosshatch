import appCss from "@/app.css?url"
import { source } from "@/lib/source"
import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { RootProvider } from "fumadocs-ui/provider/tanstack"

const DEFAULT_KEYWORDS = ["crosshatch", "embedded", "wallet", "x402"]

const getMetadata = createServerFn({ method: "GET" })
  .inputValidator((href: string) => href)
  .handler(async ({ data }) => {
    const doc = source.getPageByHref(data)
    if (doc) {
      const { description, keywords } = doc.page.data
      return {
        title: "Crosshatch",
        image: `https://crosshatch.dev/og${doc.page.url}`,
        description,
        keywords,
      }
    }
    return {
      title: "Crosshatch",
      image: "TODO_image",
      description: "An embeddable wallet for the x402 era",
      keywords: [],
    }
  })

export const Route = createRootRoute({
  loader: ({ location: { href: data } }) => getMetadata({ data }),
  head: ({ loaderData }) => {
    const { title, image, description, keywords } = loaderData!
    return {
      meta: [
        { title },
        { charSet: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        { name: "description", content: description },
        {
          name: "keywords",
          content: [
            ...DEFAULT_KEYWORDS,
            ...keywords,
          ].join(", "),
        },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:creator", content: "@CrosshatchDev" },
        { name: "twitter:site", content: "@CrosshatchDev" },
        { name: "og:type", content: "website" },
        { name: "og:title", content: title },
        { name: "og:description", content: description },
        { name: "twitter:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "og:image", content: image },
      ],
      links: [{ rel: "stylesheet", href: appCss }],
    }
  },
  component: Page,
})

function Page() {
  return (
    <html suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider search={{ options: { api: "/search" } }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  )
}
