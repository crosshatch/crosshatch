import { stringRaw } from "@crosshatch/util/string"
import { Schema as S, Context, Option, Data, Effect, flow, Struct } from "effect"

import type { Payload } from "./Payload.ts"
import { Required } from "./Required.ts"

export class CreateTraceError extends S.TaggedErrorClass<CreateTraceError>()("CreateTraceError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class ProposeError extends S.TaggedErrorClass<ProposeError>()("ProposeError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export type TraceInfo = typeof TraceInfo.Type
export const TraceInfo = S.Struct({
  traceId: S.String,
  spanId: S.String,
})

export type TraceConfig = typeof TraceConfig.Type
export const TraceConfig = S.Struct({
  trace: TraceInfo,
  name: S.String,
  description: S.String,
})

export class Proposal extends S.Class<Proposal>("Proposal")({
  trace: TraceInfo.pipe(S.optional),
  required: Required,
}) {}

export class Bridge extends Context.Service<
  Bridge,
  {
    readonly createTrace?: undefined | ((config: TraceConfig) => Effect.Effect<void, CreateTraceError>)

    readonly propose: (proposal: Proposal) => Effect.Effect<{ readonly payload: Payload }, ProposeError>
  }
>()("crosshatch/Bridge") {}

export const propose = Effect.fnUntraced(function* (proposal: Proposal) {
  const { createTrace, propose } = yield* Bridge
  const trace = proposal.trace ?? (yield* createTrace ? TraceId : Effect.undefined)
  const { required } = proposal
  return yield* propose({ required, trace })
})

export class Trace extends Context.Service<Trace, TraceConfig>()("crosshatch/Trace") {}

export const TraceId = Effect.serviceOption(Trace).pipe(
  Effect.map(flow(Option.map(Struct.get("trace")), Option.getOrUndefined)),
)

export class NoSurroundingTraceError extends Data.TaggedError("NoSurroundingTraceError") {}

export const traced =
  (name: string) =>
  (template: TemplateStringsArray | string, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* Bridge
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
