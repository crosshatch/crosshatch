import { prefix } from "@crosshatch/util/prefix"
import { Atom } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { Effect, Layer, ManagedRuntime } from "effect"
import { Bridge } from "./Bridge.ts"
import { BridgeWorkerLive } from "./BridgeWorkerLive.ts"

const memoMap = Layer.makeMemoMap.pipe(Effect.runSync)

export class BridgeClient extends Effect.Service<BridgeClient>()(prefix("kit/BridgeClient"), {
  scoped: RpcClient.make(Bridge),
  dependencies: [RpcClient.layerProtocolWorker({ size: 1 })],
}) {
  static readonly layer = BridgeClient.Default.pipe(
    Layer.provide(BridgeWorkerLive),
  )
  static readonly runtime = Atom.context({ memoMap })(this.layer)
  static readonly managedRuntime = ManagedRuntime.make(this.layer, memoMap)
}
