import { Effect, String } from "effect"

import { CurrentPaymentContext } from "./PaymentContext.ts"

export const grouped =
  (title: string) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.provideServiceEffect(
      effect,
      CurrentPaymentContext,
      Effect.sync(() => ({
        id: crypto.randomUUID(),
        metadata: {
          title,
          description: String.stripMargin(globalThis.String.raw(template, ...substitutions)).trim(),
        },
      })),
    )
