import { Context, Schema as S, type Effect } from "effect"

import type { Payload } from "./Payload.ts"
import { Required } from "./Required.ts"

export class TraceConfig extends S.Class<TraceConfig>("TraceConfig")({
  name: S.String,
  description: S.String,
}) {}

export class Trace extends S.Class<Trace>("Trace")({
  id: S.String,
  encoded: S.String,
  config: TraceConfig.pipe(S.optional),
}) {}

export class Proposal extends S.Class<Proposal>("Proposal")({
  required: Required,
  trace: Trace.pipe(S.optional),
}) {}

export class ProposeError extends S.TaggedError<ProposeError>()("ProposeError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class Propose extends Context.Service<Propose, (proposal: Proposal) => Effect.Effect<Payload, ProposeError>>()(
  "crosshatch/Propose",
) {}
