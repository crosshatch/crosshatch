import { prefix } from "@crosshatch/util"
import { RpcClient } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { EnclaveProxy } from "./EnclaveProxy.ts"
import { EnclaveProxyWorkerLive } from "./EnclaveWorkerLive.ts"

export class EnclaveProxyClient extends Effect.Service<EnclaveProxyClient>()(prefix("kit/EnclaveClient"), {
  scoped: RpcClient.make(EnclaveProxy),
  dependencies: [
    RpcClient.layerProtocolWorker({ size: 1 }).pipe(
      Layer.provide(EnclaveProxyWorkerLive),
    ),
  ],
}) {}
