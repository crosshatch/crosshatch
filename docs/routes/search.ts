import { source } from "@/lib/source"
import { createFileRoute } from "@tanstack/react-router"
import { createFromSource } from "fumadocs-core/search/server"

const server = createFromSource(source, {
  language: "english",
})

export const Route = createFileRoute("/search")({
  server: {
    handlers: {
      GET: async ({ request }) => server.GET(request),
    },
  },
})
