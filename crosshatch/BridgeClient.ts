import { runtime } from "@crosshatch/util/memoMap"
import { AtomRpc } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { Layer } from "effect"

import { Bridge } from "./Bridge.ts"
import { BridgeWorkerLive } from "./BridgeWorkerLive.ts"
import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { tag } from "./tag.ts"

export class BridgeClient extends AtomRpc.Tag<BridgeClient>()(tag("BridgeClient"), {
  group: Bridge,
  protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
    Layer.provide(BridgeWorkerLive.pipe(Layer.provide(CrosshatchEnv.layer))),
  ),
  runtime,
}) {}
