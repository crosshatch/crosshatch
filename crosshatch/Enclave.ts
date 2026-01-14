import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"
import { LinkChallengeId } from "./ChallengeId.ts"
import { DeclinedDecision } from "./DeclinedDecision.ts"

export const EnclaveLinkSuccess = S.Union(
  S.TaggedStruct("Anonymous", {
    challengeId: LinkChallengeId,
    nonce: S.UUID,
  }),
  S.TaggedStruct("Linked", {}),
)

export const EnclavePaymentSuccess = S.Union(
  S.TaggedStruct("Approved", {
    payload: S.Unknown as S.Schema<PaymentPayload>,
  }),
  DeclinedDecision,
)

export class Enclave extends RpcGroup.make(
  Rpc.make("link", {
    success: EnclaveLinkSuccess,
  }),
  Rpc.make("unlink", {}),
  Rpc.make("payment", {
    payload: {
      requirement: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: EnclavePaymentSuccess,
  }),
) {}
