import { AtomHttpApi } from "@effect-atom/atom"
import { FetchHttpClient } from "@effect/platform"

import { ContextKeys } from "./ContextKeys.ts"
import { PublicApi } from "./PublicApi.ts"

export class PublicApiClient extends AtomHttpApi.Tag<PublicApiClient>()(ContextKeys.PublicClient, {
  api: PublicApi,
  httpClient: FetchHttpClient.layer,
  baseUrl: "/api",
}) {}
