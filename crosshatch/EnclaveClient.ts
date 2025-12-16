import { RpcClient } from "@effect/rpc"
import { Effect, Layer } from "effect"
import { Enclave } from "./Enclave.ts"
import { EnclaveWorkerLive } from "./EnclaveWorkerLive.ts"

export class EnclaveClient extends Effect.Service<EnclaveClient>()("crosshatch/EnclaveClient", {
  scoped: RpcClient.make(Enclave),
  dependencies: [
    RpcClient.layerProtocolWorker({ size: 1 }).pipe(
      Layer.provide(EnclaveWorkerLive),
    ),
  ],
}) {}
