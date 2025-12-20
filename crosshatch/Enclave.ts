import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"

export class Enclave extends RpcGroup.make(
  Rpc.make("greet", {
    payload: {
      name: S.String.pipe(S.optional),
    },
    success: S.String,
  }),
  Rpc.make("session", {
    success: S.Struct({
      publicKey: S.String,
      linked: S.Boolean,
    }),
  }),
  Rpc.make("payment", {
    payload: {
      requirement: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: S.Struct({
      payload: S.Unknown as S.Schema<PaymentPayload>,
    }),
  }),
) {}
