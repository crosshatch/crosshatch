import { Schema as S, Context, Option, Data, Effect, flow, Struct } from "effect"

import { stringRaw } from "./_util.ts"
import type { Payload } from "./Payload.ts"
import { Required } from "./Required.ts"

export class CreateTraceError extends S.TaggedErrorClass<CreateTraceError>()("CreateTraceError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class ProposeError extends S.TaggedErrorClass<ProposeError>()("ProposeError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class Proposal extends S.Class<Proposal>("Proposal")({
  traceId: S.String.pipe(S.optional),
  required: Required,
}) {}

export class Bridge extends Context.Service<
  Bridge,
  {
    readonly createTrace?: undefined | ((config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>)

    readonly propose: (proposal: Proposal) => Effect.Effect<{ readonly payload: Payload }, ProposeError>
  }
>()("crosshatch/Bridge") {}

export const propose = Effect.fnUntraced(function* (proposal: Proposal) {
  const { createTrace, propose } = yield* Bridge
  const traceId = proposal.traceId ?? (yield* createTrace ? TraceId : Effect.undefined)
  const { required } = proposal
  return yield* propose({ traceId, required })
})

export const TraceConfig = S.Struct({
  traceId: S.String,
  name: S.String,
  description: S.String,
})

export class Trace extends Context.Service<Trace, typeof TraceConfig.Type>()("crosshatch/Trace") {}

export const TraceId = Effect.serviceOption(Trace).pipe(
  Effect.map(flow(Option.map(Struct.get("traceId")), Option.getOrUndefined)),
)

export class NoSurroundingTraceError extends Data.TaggedError("NoSurroundingTraceError")<{}> {}

export const traced =
  (name: string) =>
  (template: TemplateStringsArray | string, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* Bridge
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(Struct.get("traceId")),
        Effect.catchTags({
          NoSuchElementError: () => new NoSurroundingTraceError(),
        }),
      )
      const trace = {
        traceId,
        name,
        description: stringRaw(template, substitutions),
      }
      yield* createTrace?.(trace) ?? Effect.void
      return yield* Effect.provideService(effect, Trace, trace)
    }, Effect.withSpan(name))
