import { Context, Layer, Effect } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { InternalEnv } from "./InternalEnv.ts"
import { Public } from "./Public.ts"

export class CrosshatchClient extends Context.Service<CrosshatchClient>()("crosshatch/CrosshatchClient", {
  make: InternalEnv.asEffect().pipe(Effect.flatMap(({ url: baseUrl }) => HttpApiClient.make(Public, { baseUrl }))),
}) {
  static readonly layer = Layer.effect(this, this.make).pipe(Layer.provide(InternalEnv.layer))
}
