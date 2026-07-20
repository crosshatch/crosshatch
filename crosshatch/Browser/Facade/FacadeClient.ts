import { Effect, Layer, Context } from "effect"
import { RpcClient } from "effect/unstable/rpc"

import { FacadeRpcGroup } from "./FacadeRpcGroup.ts"
import * as FacadeWorker from "./FacadeWorker.ts"

export class FacadeClient extends Context.Service<FacadeClient>()("crosshatch/FacadeClient", {
  make: RpcClient.make(FacadeRpcGroup).pipe(
    Effect.provide(RpcClient.layerProtocolWorker({ size: 1 }).pipe(Layer.provide(FacadeWorker.layer))),
  ),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
