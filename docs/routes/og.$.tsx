import { source } from "@/lib/source"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { ImageResponse } from "@vercel/og"

export const Route = createFileRoute("/og/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const page = source.getPage([params._splat ?? ""])
        if (!page) throw notFound()
        const { description, title } = page.data
        return new ImageResponse(
          <div
            style={{
              display: "flex",
              flex: 1,
              height: "100%",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              lineHeight: 0,
              backgroundColor: "#000",
              color: "#fff",
            }}
          >
            <h1 style={{ fontSize: 55 }}>crosshatch.dev</h1>
            <h2 style={{ fontSize: 85, marginTop: 120 }}>{title}</h2>
            <h3 style={{ fontSize: 50, marginTop: 65 }}>{description}</h3>
          </div>,
        )
      },
    },
  },
})
