import { prefix } from "@crosshatch/util"
import { AtomRpc } from "@effect-atom/atom-react"
import { RpcClient } from "@effect/rpc"
import { Bridge, BridgeWorkerLive } from "crosshatch"
import { Layer } from "effect"

export class BridgeClient extends AtomRpc.Tag<BridgeClient>()(
  prefix("react/BridgeClient"),
  {
    group: Bridge,
    protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
      Layer.provide(BridgeWorkerLive),
    ),
  },
) {}
