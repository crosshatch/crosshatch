import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentPayload, PaymentRequired } from "@x402/core/types"
import { Schema as S } from "effect"
import { DeclinedDecision } from "./DeclinedDecision.ts"
import { Status } from "./Status.ts"

export class Bridge extends RpcGroup.make(
  Rpc.make("status", {
    success: Status,
  }),
  Rpc.make("unlink", {}),
  Rpc.make("propose", {
    payload: {
      required: S.Unknown as S.Schema<PaymentRequired>,
    },
    success: S.Union(
      S.TaggedStruct("Approved", {
        payload: S.Unknown as S.Schema<PaymentPayload>,
      }),
      DeclinedDecision,
    ),
  }),
) {}
