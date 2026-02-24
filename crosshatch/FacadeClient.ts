import { runtime } from "@crosshatch/util/memoMap"
import { AtomRpc } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { Layer } from "effect"

import { CrosshatchEnv } from "./CrosshatchEnv.ts"
import { Facade } from "./Facade.ts"
import { FacadeWorker } from "./FacadeWorker.ts"
import { tag } from "./tag.ts"

export class FacadeClient extends AtomRpc.Tag<FacadeClient>()(tag("FacadeClient"), {
  group: Facade,
  protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
    Layer.provide(FacadeWorker.pipe(Layer.provide(CrosshatchEnv.layer))),
  ),
  runtime,
}) {}
