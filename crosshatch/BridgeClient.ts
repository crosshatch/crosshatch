import { Atom } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { ConfigProvider, Effect, Layer, ManagedRuntime } from "effect"
import { Bridge } from "./Bridge.ts"
import { BridgeWorkerLive } from "./BridgeWorkerLive.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { ContextKeys } from "./ContextKeys.ts"
import { resolveEnv } from "@crosshatch/util/resolveEnv"

const memoMap = Layer.makeMemoMap.pipe(Effect.runSync)

// TODO: crosshatch_internal flag
export class BridgeClient extends Effect.Service<BridgeClient>()(ContextKeys.BridgeClient, {
  scoped: RpcClient.make(Bridge),
  dependencies: [RpcClient.layerProtocolWorker({ size: 1 })],
}) {
  static readonly layer = BridgeClient.Default.pipe(
    Layer.provide(BridgeWorkerLive),
    Layer.provideMerge(
      CrosshatchEnv.layer.pipe(
        Layer.provideMerge(Layer.setConfigProvider(ConfigProvider.fromJson(resolveEnv()))),
      ),
    ),
  )
  static readonly atomRuntime = Atom.context({ memoMap })(this.layer)
  static readonly managedRuntime = ManagedRuntime.make(this.layer, memoMap)
}
