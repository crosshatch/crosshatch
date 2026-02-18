import { runtime } from "@crosshatch/util/memoMap"
import { AtomRpc } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { Layer } from "effect"

import { Bridge } from "./Bridge.ts"
import { BridgeWorkerLive } from "./BridgeWorkerLive.ts"
import { ContextKeys } from "./ContextKeys.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"

export class BridgeClient extends AtomRpc.Tag<BridgeClient>()(ContextKeys.BridgeClient, {
  group: Bridge,
  protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
    Layer.provide(BridgeWorkerLive.pipe(Layer.provide(CrosshatchEnv.layer))),
  ),
  runtime,
}) {}
