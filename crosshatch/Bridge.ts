import { Rpc, RpcGroup } from "@effect/rpc"
import { Schema as S } from "effect"

import { DeclinedDecision } from "./DeclinedDecision.ts"
import { LinkChallengeId } from "./LinkChallenge.ts"
import { Payload } from "./X402/Payload.ts"
import { Required } from "./X402/Required.ts"

export class Bridge extends RpcGroup.make(
  Rpc.make("GetChallenge", {
    success: S.Option(LinkChallengeId),
  }),
  Rpc.make("Propose", {
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
  Rpc.make("Unlink", {}),
) {}
