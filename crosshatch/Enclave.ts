import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"
import { DeclinedDecision } from "./models/models.ts"

export const EnclavePaymentSuccess = S.Union(
  S.TaggedStruct("Approved", {
    payload: S.Unknown as S.Schema<PaymentPayload>,
  }),
  DeclinedDecision,
)

export class Enclave extends RpcGroup.make(
  Rpc.make("link", {
    success: S.Union(
      S.TaggedStruct("Untouched", {
        challengeId: S.UUID,
      }),
      S.TaggedStruct("Linked", {}),
    ),
  }),
  Rpc.make("unlink", {}),
  Rpc.make("payment", {
    payload: {
      requirement: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: EnclavePaymentSuccess,
  }),
) {}
