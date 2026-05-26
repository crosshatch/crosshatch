import { Context, Effect, String } from "effect"

import { PaymentBridge } from "./PaymentBridge.ts"

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
      const { createTrace } = yield* PaymentBridge
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(({ traceId }) => traceId),
        Effect.catchTag("NoSuchElementError", Effect.die),
      )
      const trace = {
        traceId,
        name,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
      }
      yield* createTrace(trace)
      return yield* Effect.provideService(effect, Trace, trace)
    }, Effect.withSpan(name))
