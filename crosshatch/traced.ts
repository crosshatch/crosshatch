import { Data, Effect, String } from "effect"

import { Payer } from "./Payer.ts"
import { Trace } from "./Trace.ts"

export class NoSuchTraceError extends Data.TaggedError("NoSuchTraceError")<{}> {}

export const traced =
  (name: string) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* Payer
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(({ traceId }) => traceId),
        Effect.catchTags({
          NoSuchElementError: () => new NoSuchTraceError(),
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
