import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"
import { DeclinedDecision } from "./DeclinedDecision.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"

export const LinkState = S.Union(
  S.TaggedStruct("Anonymous", {
    challengeId: LinkChallengeId,
  }),
  S.TaggedStruct("Linked", {}),
)

export class Bridge extends RpcGroup.make(
  Rpc.make("linkState", {
    success: LinkState,
  }),
  Rpc.make("unlink", {}),
  Rpc.make("payment", {
    payload: {
      requirement: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: S.Union(
      S.TaggedStruct("Approved", {
        payload: S.Unknown as S.Schema<PaymentPayload>,
      }),
      DeclinedDecision,
    ),
  }),
) {}
