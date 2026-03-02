import { AtomHttpApi } from "@effect-atom/atom"
import { FetchHttpClient } from "@effect/platform"

import { Public } from "./Public.ts"
import { tag } from "./tag.ts"

export class PublicClient extends AtomHttpApi.Tag<PublicClient>()(tag("PublicClient"), {
  api: Public,
  httpClient: FetchHttpClient.layer,
  baseUrl: "/api",
}) {}
