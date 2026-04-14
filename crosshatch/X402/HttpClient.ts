import { Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { makeFetch } from "./makeFetch.ts"

export const HttpClient = FetchHttpClient.layer.pipe(
  Layer.provide(Layer.succeed(FetchHttpClient.Fetch, makeFetch(fetch))),
)
