import { source } from "@/lib/source"
import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import dedent from "dedent"

const getPages = createServerFn({ method: "GET" }).handler(() => {
  return Promise.all(
    source.getPages().map(async (page) =>
      dedent`
        # ${page.data.title} (${page.url})

        ${await page.data.getText("processed")}
      `
    ),
  )
})

export const Route = createFileRoute("/llms-full.txt")({
  server: {
    handlers: {
      GET: () => getPages().then((v) => new Response(v.join("\n\n"))),
    },
  },
})
