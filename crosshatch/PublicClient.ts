import { runtime } from "@crosshatch/util/runtime"
import { FetchHttpClient } from "effect/unstable/http"
import { AtomHttpApi } from "effect/unstable/reactivity"

import { Public } from "./Public.ts"

export class PublicClient extends AtomHttpApi.Service<PublicClient>()("crosshatch/PublicClient", {
  api: Public,
  httpClient: FetchHttpClient.layer,
  runtime,
}) {}
