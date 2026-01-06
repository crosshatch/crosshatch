import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"

export class PaymentError extends S.TaggedError<PaymentError>("PaymentError")("PaymentError", {}) {}

export class Enclave extends RpcGroup.make(
  Rpc.make("installationInfo", {
    success: S.Struct({
      installationId: S.UUID,
      linked: S.Boolean,
    }),
  }),
  Rpc.make("rotate", {}),
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
