import { AtomRpc, Atom } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { Effect, Layer, ManagedRuntime } from "effect"

import { Bridge } from "./Bridge.ts"
import { BridgeWorkerLive } from "./BridgeWorkerLive.ts"
import { ContextKeys } from "./ContextKeys.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"

const memoMap = Layer.makeMemoMap.pipe(Effect.runSync)

const runtime = Atom.context({ memoMap })

export class BridgeClient extends AtomRpc.Tag<BridgeClient>()(ContextKeys.BridgeClient, {
  group: Bridge,
  protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
    Layer.provide(BridgeWorkerLive.pipe(Layer.provide(CrosshatchEnv.layer))),
  ),
  runtime,
}) {
  static readonly CommonLive = Layer.mergeAll(BridgeClient.layer, CrosshatchEnv.layer)
  static readonly atomRuntime = runtime(this.CommonLive)
  static readonly managedRuntime = ManagedRuntime.make(this.CommonLive, memoMap)
}
