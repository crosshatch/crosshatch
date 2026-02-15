import { Tool, Toolkit } from "@effect/ai"
import dedent from "dedent"
import { Schema as S } from "effect"

export const FirecrawlToolkit = Toolkit.make(
  Tool.make("FirecrawlSearch", {
    description: dedent`
    Search the web using Firecrawl. Returns titles, URLs, and descriptions.
    Use FirecrawlScrape to get the full markdown content of a specific URL.
    Use a limit of 5 unless otherwise specified.
  `,
    parameters: {
      query: S.String,
      limit: S.Number,
    },
    success: S.Struct({
      results: S.Array(
        S.Struct({
          url: S.String,
          title: S.String,
          description: S.String,
        }),
      ),
    }),
  }),
  Tool.make("FirecrawlScrape", {
    description: "Scrape a URL and return its content as clean markdown.",
    parameters: { url: S.String },
    success: S.Struct({
      url: S.String,
      markdown: S.String,
    }),
  }),
)
