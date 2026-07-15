import { Schema as S, Context, PubSub } from "effect"

import { Proposal, TraceConfig } from "../Bridge.ts"

export const ChxEvent = S.TaggedUnion({
  CreateTrace: { config: TraceConfig },
  Propose: { proposal: Proposal },
})

export class ChxEvents extends Context.Service<ChxEvents, PubSub.PubSub<typeof ChxEvent.Type>>()(
  "crosshatch/ChxRpc/ChxEvents",
) {}
