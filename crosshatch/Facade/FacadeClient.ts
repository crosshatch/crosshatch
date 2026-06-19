import { Payload, Required } from "@crosshatch/x402"
import { Schema as S } from "effect"
import { Client } from "liminal"

import { ProposeError } from "../errors.ts"
import { InvoiceId } from "../Invoice.ts"
import { LinkChallengeId } from "../LinkChallengeId.ts"
import { TraceConfig } from "../TraceConfig.ts"

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
        invoiceId: InvoiceId.pipe(S.optional),
        traceId: S.String.pipe(S.optional),
        required: Required.Required,
      }),
      success: S.Struct({
        payload: Payload.Payload,
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
