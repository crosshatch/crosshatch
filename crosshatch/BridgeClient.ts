import { prefix } from "@crosshatch/util/prefix"
import { RpcClient } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { Bridge } from "./Bridge.ts"
import { BridgeWorkerLive } from "./BridgeWorkerLive.ts"

export class BridgeClient extends Effect.Service<BridgeClient>()(
  prefix("kit/BridgeClient"),
  {
    scoped: RpcClient.make(Bridge),
    dependencies: [
      RpcClient.layerProtocolWorker({ size: 1 }).pipe(
        Layer.provide(BridgeWorkerLive),
      ),
    ],
  },
) {}
