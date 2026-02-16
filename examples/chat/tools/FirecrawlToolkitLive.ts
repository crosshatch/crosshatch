import { HttpBody, HttpClient, HttpClientRequest, HttpClientResponse } from "@effect/platform"
import { CrosshatchHttpClient } from "crosshatch"
import { Config, Effect, flow, Layer, Redacted, Schema as S } from "effect"
import { FirecrawlToolkit } from "./FirecrawlToolkit"

const FirecrawlSearchResponse = S.Struct({
  data: S.Array(
    S.Struct({
      description: S.String,
      title: S.String,
      url: S.String,
    }),
  ),
})

const FirecrawlScrapeResponse = S.Struct({
  data: S.Struct({ markdown: S.String }),
})

class FirecrawlClient extends Effect.Service<FirecrawlClient>()("FirecrawlClient", {
  dependencies: [CrosshatchHttpClient],
  effect: Effect.gen(function* () {
    const apiKey = yield* Config.redacted("VITE_PUBLIC_FIRECRAWL_API_KEY")
    const httpClient = yield* HttpClient.HttpClient
    const client = httpClient.pipe(
      HttpClient.mapRequest(
        flow(
          HttpClientRequest.prependUrl("https://api.firecrawl.dev/v1"),
          HttpClientRequest.bearerToken(Redacted.value(apiKey)),
        ),
      ),
    )
    return { client } as const
  }),
}) {}

export const FirecrawlToolkitLive = FirecrawlToolkit.toLayer(
  Effect.gen(function* () {
    const { client } = yield* FirecrawlClient
    return {
      FirecrawlScrape: Effect.fn(function* ({ url }) {
        return yield* client
          .post("/scrape", {
            acceptJson: true,
            body: yield* HttpBody.json({ formats: ["markdown"], url }),
          })
          .pipe(
            Effect.flatMap(HttpClientResponse.schemaBodyJson(FirecrawlScrapeResponse)),
            Effect.map((res) => ({ markdown: res.data.markdown, url })),
          )
      }, Effect.orDie),
      FirecrawlSearch: Effect.fn(function* ({ query, limit }) {
        return yield* client
          .post("/search", {
            acceptJson: true,
            body: yield* HttpBody.json({
              limit: limit ?? 5,
              query,
            }),
          })
          .pipe(
            Effect.flatMap(HttpClientResponse.schemaBodyJson(FirecrawlSearchResponse)),
            Effect.map((res) => ({
              results: res.data.map((r) => ({
                description: r.description,
                title: r.title,
                url: r.url,
              })),
            })),
          )
      }, Effect.orDie),
    }
  }),
).pipe(Layer.provide(FirecrawlClient.Default))
