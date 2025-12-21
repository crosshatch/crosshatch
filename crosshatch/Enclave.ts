import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"

export type SessionDetails = typeof SessionDetails["Type"]
export const SessionDetails = S.Union(
  S.TaggedStruct("linked", {}),
  S.TaggedStruct("unverified", {
    sessionId: S.UUID,
  }),
)

export class Enclave extends RpcGroup.make(
  Rpc.make("session", {
    success: SessionDetails,
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
