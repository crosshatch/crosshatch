import { AtomHttpApi } from "@effect-atom/atom"
import { FetchHttpClient } from "@effect/platform"

import { Public } from "./Public.ts"

export class PublicClient extends AtomHttpApi.Tag<PublicClient>()("crosshatch/PublicClient", {
  api: Public,
  httpClient: FetchHttpClient.layer,
  baseUrl: "/api",
}) {}
