import { PaymentPayload, PaymentRequired } from "@crosshatch/x402"
import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema as S } from "effect"
import { InstallationInfo, PaymentError } from "./models/models.ts"

export class Enclave extends RpcGroup.make(
  Rpc.make("installationInfo", {
    success: InstallationInfo,
  }),
  Rpc.make("rotate", {}),
  Rpc.make("payment", {
    payload: {
      requirement: PaymentRequired,
    },
    success: S.Struct({
      payload: PaymentPayload,
    }),
    error: PaymentError,
  }),
) {}
