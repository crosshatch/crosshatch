import { FetchHttpClient } from "@effect/platform"
import { Layer } from "effect"
import { makeFetch } from "./makeFetch.ts"

export const FetchHttpClientLive = FetchHttpClient.layer.pipe(
  Layer.provide(
    Layer.succeed(FetchHttpClient.Fetch, makeFetch(fetch)),
  ),
)
