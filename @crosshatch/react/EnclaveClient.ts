import { prefix } from "@crosshatch/util"
import { AtomRpc } from "@effect-atom/atom-react"
import { RpcClient } from "@effect/rpc"
import { Enclave, EnclaveWorkerLive } from "crosshatch"
import { Layer } from "effect"

export class EnclaveClient extends AtomRpc.Tag<EnclaveClient>()(prefix("react/EnclaveClient"), {
  group: Enclave,
  protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
    Layer.provide(EnclaveWorkerLive),
  ),
}) {}
