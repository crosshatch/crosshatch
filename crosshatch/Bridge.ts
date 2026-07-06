import { String, Schema as S, Context, Option, Data, Effect, flow } from "effect"

import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"

export class CreateTraceError extends S.TaggedErrorClass<CreateTraceError>()("CreateTraceError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class ProposeError extends S.TaggedErrorClass<ProposeError>()("ProposeError", {
  cause: S.Unknown.pipe(S.optional),
}) {}

export class Bridge extends Context.Service<
  Bridge,
  {
    readonly createTrace?: undefined | ((config: typeof TraceConfig.Type) => Effect.Effect<void, CreateTraceError>)

    readonly propose: (config: {
      readonly traceId?: string | undefined
      readonly required: typeof Required.Type
    }) => Effect.Effect<{ readonly payload: typeof Payload.Type }, ProposeError>
  }
>()("crosshatch/Bridge") {}

export const propose = Effect.fnUntraced(function* (config: {
  readonly traceId?: string | undefined
  readonly required: typeof Required.Type
}) {
  const { createTrace, propose } = yield* Bridge
  const traceId = config.traceId ?? (yield* createTrace ? TraceId : Effect.undefined)
  const { required } = config
  return yield* propose({ traceId, required })
})

export const TraceConfig = S.Struct({
  traceId: S.String,
  name: S.String,
  description: S.String,
})

export class Trace extends Context.Service<Trace, typeof TraceConfig.Type>()("crosshatch/Trace") {}

export const TraceId = Effect.serviceOption(Trace).pipe(
  Effect.map(
    flow(
      Option.map(({ traceId }) => traceId),
      Option.getOrUndefined,
    ),
  ),
)

export class NoSurroundingTraceError extends Data.TaggedError("NoSurroundingTraceError")<{}> {}

export const traced =
  (name: string) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* Bridge
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(({ traceId }) => traceId),
        Effect.catchTags({
          NoSuchElementError: () => new NoSurroundingTraceError(),
        }),
      )
      const trace = {
        traceId,
        name,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
      }
      yield* createTrace?.(trace) ?? Effect.void
      return yield* Effect.provideService(effect, Trace, trace)
    }, Effect.withSpan(name))
