import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema as S } from "effect"

import { DeclinedDecision } from "./DeclinedDecision.ts"
import { Status } from "./Status.ts"
import { PaymentPayload, PaymentRequired } from "./X402/schemas.ts"

export class Bridge extends RpcGroup.make(
  Rpc.make("status", {
    success: Status,
  }),
  Rpc.make("unlink", {}),
  Rpc.make("propose", {
    payload: {
      required: PaymentRequired,
    },
    success: S.Union(
      S.TaggedStruct("Approved", {
        payload: PaymentPayload,
      }),
      DeclinedDecision,
    ),
  }),
) {}
