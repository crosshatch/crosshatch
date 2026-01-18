import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"
import { DeclinedDecision } from "./DeclinedDecision.ts"
import { LinkChallenge } from "./LinkChallenge.ts"

export class EnclaveProxy extends RpcGroup.make(
  Rpc.make("challenge", {
    success: LinkChallenge.pipe(S.Option),
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
