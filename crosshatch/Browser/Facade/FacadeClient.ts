import { Schema as S } from "effect"
import { Client } from "liminal"

import { Payload } from "../../Payload.ts"
import { PaymentId } from "../../PaymentId.ts"
import { Required } from "../../Required.ts"
import { TraceConfig } from "../../traced.ts"
import { LinkChallengeId } from "../LinkChallengeId.ts"
import { ProposeError } from "../ProposeError.ts"

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
        paymentId: PaymentId.pipe(S.optional),
      }),
      success: S.Struct({
        payload: Payload,
      }),
      failure: ProposeError,
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
