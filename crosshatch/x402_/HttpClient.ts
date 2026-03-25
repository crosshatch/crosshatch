import { FetchHttpClient } from "@effect/platform"
import { Layer } from "effect"

import { makeFetch } from "./makeFetch.ts"

export const HttpClient = FetchHttpClient.layer.pipe(
  Layer.provide(Layer.succeed(FetchHttpClient.Fetch, makeFetch(fetch))),
)
