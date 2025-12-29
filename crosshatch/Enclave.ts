import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"

export type SessionDetails = typeof SessionDetails["Type"]
export const SessionDetails = S.Union(
  S.TaggedStruct("Blank", { identityId: S.String }),
  S.TaggedStruct("Linked", {
    addresses: S.Struct({
      evm: S.String,
      svm: S.String,
    }),
  }),
  S.TaggedStruct("Revoked", {}),
)

export class Enclave extends RpcGroup.make(
  Rpc.make("sessionDetails", {
    success: SessionDetails,
  }),
  Rpc.make("revoke", {}),
  Rpc.make("payment", {
    payload: {
      requirement: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: S.Struct({
      payload: S.Unknown as S.Schema<PaymentPayload>,
    }),
  }),
) {}
