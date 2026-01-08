import { PaymentPayload, PaymentRequired } from "@crosshatch/x402"
import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema as S } from "effect"
import { Link, PaymentError } from "./models/models.ts"

export class Enclave extends RpcGroup.make(
  Rpc.make("link", {
    success: Link,
  }),
  Rpc.make("unlink", {}),
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
