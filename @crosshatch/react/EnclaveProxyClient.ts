import { prefix } from "@crosshatch/util"
import { AtomRpc } from "@effect-atom/atom-react"
import { RpcClient } from "@effect/rpc"
import { EnclaveProxy, EnclaveProxyWorkerLive } from "crosshatch"
import { Layer } from "effect"

export class EnclaveProxyClient extends AtomRpc.Tag<EnclaveProxyClient>()(
  prefix("react/EnclaveProxyClient"),
  {
    group: EnclaveProxy,
    protocol: RpcClient.layerProtocolWorker({ size: 1 }).pipe(
      Layer.provide(EnclaveProxyWorkerLive),
    ),
  },
) {}
