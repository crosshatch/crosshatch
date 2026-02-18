import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema as S } from "effect"

import { DeclinedDecision } from "./DeclinedDecision.ts"
import { Status } from "./Status.ts"
import { Payload } from "./X402/Payload.ts"
import { Required } from "./X402/Required.ts"

export class Bridge extends RpcGroup.make(
  Rpc.make("status", {
    success: Status,
  }),
  Rpc.make("unlink", {}),
  Rpc.make("propose", {
    payload: {
      required: Required,
    },
    success: S.Union(
      S.TaggedStruct("Approved", {
        payload: Payload,
      }),
      DeclinedDecision,
    ),
  }),
) {}
