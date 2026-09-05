import { stringRaw } from "@crosshatch/util"
import { Schema as S, Context, Data, Effect, Struct } from "effect"

import type { Payload } from "./Payload.ts"
import { Required } from "./Required.ts"
import { TraceInfo, type TraceConfig, Trace, TraceId } from "./Trace.ts"

export class CreateTraceError extends S.TaggedError<CreateTraceError>()("CreateTraceError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class Proposal extends S.Class<Proposal>("Proposal")({
  trace: TraceInfo.pipe(S.optional),
  required: Required,
}) {}

export class ProposeError extends S.TaggedError<ProposeError>()("ProposeError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class Remote extends Context.Service<
  Remote,
  {
    readonly createTrace?: undefined | ((config: TraceConfig) => Effect.Effect<void, CreateTraceError>)

    readonly propose: (proposal: Proposal) => Effect.Effect<{ readonly payload: Payload }, ProposeError>
  }
>()("crosshatch/Remote") {}

export const propose = Effect.fnUntraced(function* (proposal: Proposal) {
  const { createTrace, propose } = yield* Remote
  const trace = proposal.trace ?? (yield* createTrace ? TraceId : Effect.undefined)
  const { required } = proposal
  return yield* propose({ required, trace })
})

export class NoSurroundingTraceError extends Data.TaggedError("NoSurroundingTraceError") {}

export const traced =
  (name: string) =>
  (template: TemplateStringsArray | string, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* Remote
      const trace = yield* Effect.currentSpan.pipe(
        Effect.map(Struct.pick(["traceId", "spanId"])),
        Effect.catchTags({
          NoSuchElementError: () => new NoSurroundingTraceError(),
        }),
      )
      const description = stringRaw(template, substitutions)
      const config: TraceConfig = { trace, name, description }
      yield* createTrace?.(config) ?? Effect.void
      return yield* Effect.provideService(effect, Trace, config)
    }, Effect.withSpan(name))
