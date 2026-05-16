import { Client } from "liminal"
import { Schema as S } from "effect"
import { LinkChallengeId } from "../LinkChallengeId.ts"
import { Payload, Required } from "@crosshatch/x402"
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
      payload: S.Struct({
        required: Required.Required,
      }),
      success: S.Struct({
        payload: Payload.Payload,
      }),
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
