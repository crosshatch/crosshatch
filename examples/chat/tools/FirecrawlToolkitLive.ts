import { HttpBody, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { FetchLive } from "crosshatch"
import { Config, Console, Effect, flow, Layer, Redacted, Schema as S } from "effect"
import { FirecrawlToolkit } from "./FirecrawlToolkit"

const FirecrawlSearchResponse = S.Struct({
  data: S.Array(S.Struct({
    url: S.String,
    title: S.String,
    description: S.String,
  })),
})

const FirecrawlScrapeResponse = S.Struct({
  data: S.Struct({ markdown: S.String }),
})

class FirecrawlClient extends Effect.Service<FirecrawlClient>()("FirecrawlClient", {
  dependencies: [FetchLive],
  effect: Effect.gen(function*() {
    const apiKey = yield* Config.redacted("VITE_PUBLIC_FIRECRAWL_API_KEY")
    const httpClient = yield* HttpClient.HttpClient
    const client = httpClient.pipe(
      HttpClient.mapRequest(flow(
        HttpClientRequest.prependUrl("https://api.firecrawl.dev/v1"),
        HttpClientRequest.bearerToken(Redacted.value(apiKey)),
      )),
    )
    return { client } as const
  }),
}) {}

export const FirecrawlToolkitLive = FirecrawlToolkit.toLayer(
  Effect.gen(function*() {
    const { client } = yield* FirecrawlClient
    return {
      FirecrawlSearch: Effect.fn(function*({ query, limit }) {
        return yield* client.post("/search", {
          body: yield* HttpBody.json({
            query,
            limit: limit ?? 5,
          }),
          acceptJson: true,
        }).pipe(
          Effect.flatMap(HttpClientResponse.schemaBodyJson(FirecrawlSearchResponse)),
          Effect.map((res) => ({
            results: res.data.map((r) => ({
              url: r.url,
              title: r.title,
              description: r.description,
            })),
          })),
        )
      }, Effect.orDie),
      FirecrawlScrape: Effect.fn(function*({ url }) {
        return yield* client.post("/scrape", {
          body: yield* HttpBody.json({ url, formats: ["markdown"] }),
          acceptJson: true,
        }).pipe(
          Effect.flatMap(HttpClientResponse.schemaBodyJson(FirecrawlScrapeResponse)),
          Effect.tap(Console.log),
          Effect.map((res) => ({ url, markdown: res.data.markdown })),
        )
      }, Effect.orDie),
    }
  }),
).pipe(
  Layer.provide(FirecrawlClient.Default),
)
