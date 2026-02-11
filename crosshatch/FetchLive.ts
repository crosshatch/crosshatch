import { FetchHttpClient } from "@effect/platform"
import { Layer } from "effect"
import { makeFetch } from "./makeFetch.ts"

export const FetchLive = FetchHttpClient.layer.pipe(
  Layer.provide(
    Layer.succeed(FetchHttpClient.Fetch, makeFetch(fetch)),
  ),
)
