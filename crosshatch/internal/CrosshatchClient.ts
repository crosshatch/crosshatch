import { Context, Effect, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { Stage } from "../Stage.ts"
import { CrosshatchApi } from "./CrosshatchApi.ts"

export class CrosshatchClient extends Context.Service<CrosshatchClient>()("crosshatch/CrosshatchClient", {
  make: Effect.gen(function* () {
    const { domain } = yield* Stage
    return yield* HttpApiClient.make(CrosshatchApi, {
      baseUrl: domain(),
    })
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
