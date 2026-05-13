import { Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"

import { makeFetch } from "./makeFetch.ts"

const fetch_ = makeFetch(fetch)
export { fetch_ as fetch }

export const CrosshatchHttpClient = FetchHttpClient.layer.pipe(
  Layer.provide(Layer.succeed(FetchHttpClient.Fetch, fetch_)),
)
