import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"
import { Link, PaymentError } from "./models/models.ts"

export class Enclave extends RpcGroup.make(
  Rpc.make("link", {
    success: Link,
  }),
  Rpc.make("unlink", {}),
  Rpc.make("payment", {
    payload: {
      requirement: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: S.Struct({
      payload: S.Unknown as S.Schema<PaymentPayload>,
    }),
    error: PaymentError,
  }),
) {}
