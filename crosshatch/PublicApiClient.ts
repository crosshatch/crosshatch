import { AtomHttpApi } from "@effect-atom/atom"
import { FetchHttpClient } from "@effect/platform"

import { PublicApi } from "./PublicApi.ts"
import { tag } from "./tag.ts"

export class PublicApiClient extends AtomHttpApi.Tag<PublicApiClient>()(tag("PublicClient"), {
  api: PublicApi,
  httpClient: FetchHttpClient.layer,
  baseUrl: "/api",
}) {}
