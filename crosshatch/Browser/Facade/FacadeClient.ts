import { Schema as S } from "effect"
import { Client } from "liminal"

import { TraceConfig } from "../../Bridge.ts"
import { Payload } from "../../Payload.ts"
import { Required } from "../../Required.ts"
import { BrowserProposeError } from "../BrowserProposeError.ts"
import { LinkChallengeId } from "../LinkChallengeId.ts"

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
    CreateTrace: {
      payload: TraceConfig,
      success: S.Void,
      failure: S.Never,
    },
    Propose: {
      payload: S.Struct({
        traceId: S.String.pipe(S.optional),
        required: Required,
      }),
      success: S.Struct({
        payload: Payload,
      }),
      failure: BrowserProposeError,
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
