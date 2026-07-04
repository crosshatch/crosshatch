import { Context, Effect, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { Stage } from "../Stage.ts"
import { RampApi } from "./RampApi.ts"

export class RampClient extends Context.Service<RampClient>()("crosshatch/RampClient", {
  make: Effect.gen(function* () {
    const { domain } = yield* Stage
    return yield* HttpApiClient.make(RampApi, {
      baseUrl: domain("ramp"),
    }).pipe(Effect.map(({ ramp }) => ramp))
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
