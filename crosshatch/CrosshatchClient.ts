import { Context, Layer, Effect } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { InternalEnv } from "./InternalEnv.ts"
import { Public } from "./Public.ts"

export class CrosshatchClient extends Context.Service<CrosshatchClient>()("crosshatch/CrosshatchClient", {
  make: InternalEnv.pipe(
    Effect.flatMap(({ url }) => HttpApiClient.make(Public, { baseUrl: url })),
    Effect.provide(InternalEnv.layer),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
