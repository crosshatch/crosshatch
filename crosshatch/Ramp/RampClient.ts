import { Context, Effect, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { RampApi } from "./RampApi.ts"

export class RampClient extends Context.Service<RampClient>()("crosshatch/RampClient", {
  make: HttpApiClient.make(RampApi, { baseUrl: "https://cirque.sh" }).pipe(Effect.map(({ ramp }) => ramp)),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
