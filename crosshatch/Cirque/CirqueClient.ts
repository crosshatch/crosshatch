import { Context, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { CirqueApi } from "./CirqueApi.ts"

export class CirqueClient extends Context.Service<CirqueClient>()("crosshatch/CirqueClient", {
  make: HttpApiClient.make(CirqueApi, { baseUrl: "https://cirque.sh" }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
