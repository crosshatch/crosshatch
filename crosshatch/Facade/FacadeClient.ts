import { Payload } from "@crosshatch/x402"
import { Schema as S } from "effect"
import { Client } from "liminal"

import { LinkChallengeId } from "../LinkChallengeId.ts"
import { RequiredEnvelope } from "../merchant/merchant.ts"
import { DeclinedError } from "./errors.ts"

export class FacadeClient extends Client.Service<FacadeClient>()("crosshatch/FacadeClient", {
  events: {
    Challenged: {
      challengeId: LinkChallengeId,
    },
    Linked: {},
  },
  external: {
    Rescind: {
      payload: S.Void,
      success: S.Void,
      failure: S.Never,
    },
    Propose: {
      payload: RequiredEnvelope,
      success: S.Struct({ payload: Payload.Payload }),
      failure: DeclinedError,
    },
  },
  state: {
    status: S.TaggedUnion({
      Challenged: {
        challengeId: LinkChallengeId,
      },
      Linked: {},
    }),
  },
}) {}
