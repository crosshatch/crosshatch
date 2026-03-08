import { runtime } from "@crosshatch/util/runtime"
import { AtomRpc } from "@effect-atom/atom"
import { RpcClient } from "@effect/rpc"
import { Layer } from "effect"

import * as CrosshatchEnv from "./CrosshatchEnv.ts"
import { Facade } from "./Facade.ts"
import { FacadeWorker } from "./FacadeWorker.ts"

export class FacadeClient extends AtomRpc.Tag<FacadeClient>()("FacadeClient", {
  group: Facade,
  protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
    Layer.provide(FacadeWorker.pipe(Layer.provide(CrosshatchEnv.layer))),
  ),
  runtime,
}) {}
