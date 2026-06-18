import { Bridge } from "crosshatch"
import { Context, Option, Effect, flow, String } from "effect"

export class Trace extends Context.Service<
  Trace,
  {
    readonly traceId: string
    readonly name: string
    readonly description: string
  }
>()("@crosshatch/merchant/Trace") {}

export const traced =
  (name: string) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* Bridge
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(({ traceId }) => traceId),
        Effect.catchTags({
          NoSuchElementError: Effect.die,
        }),
      )
      const trace = {
        traceId,
        name,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
      }
      yield* createTrace(trace)
      return yield* Effect.provideService(effect, Trace, trace)
    }, Effect.withSpan(name))

export const CurrentTraceId = Effect.serviceOption(Trace).pipe(
  Effect.map(
    flow(
      Option.map(({ traceId }) => traceId),
      Option.getOrUndefined,
    ),
  ),
)
