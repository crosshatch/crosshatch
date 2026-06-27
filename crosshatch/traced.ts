import { Option, Data, String, Schema as S, Context, Effect, flow } from "effect"

import { Payer } from "./Payer.ts"

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
      const { createTrace } = yield* Payer
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
