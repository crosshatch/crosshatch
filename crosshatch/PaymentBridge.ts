import type { AccountAddress } from "@crosshatch/caip"
import { Required, Requirements } from "@crosshatch/x402"
import { Micros, CurrentPaymentContext, PaymentContext } from "crosshatch"
import { Context, Effect, String } from "effect"

import { BASE_USDC } from "./Micros.ts"

export class PaymentBridge extends Context.Service<
  PaymentBridge,
  {
    readonly recipient: typeof AccountAddress.Type
    readonly take: ({
      context,
      required,
    }: {
      readonly context: typeof PaymentContext.Type
      readonly required: typeof Required.Required.Type
    }) => Effect.Effect<void>
  }
>()("crosshatch/Bridge") {}

export const charge =
  (amount: typeof Micros.Micros.Type) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.gen(function* () {
      const { take, recipient } = yield* PaymentBridge
      const context = yield* CurrentPaymentContext
      yield* take({
        context,
        required: Required.Required.make({
          x402Version: 2,
          accepts: [
            Requirements.Requirements.make({
              amount: Micros.toX402(amount, BASE_USDC),
              asset: BASE_USDC.asset,
              extra: {
                name: "USDC",
                version: "2",
              },
              maxTimeoutSeconds: 60,
              network: BASE_USDC.network,
              payTo: recipient,
              scheme: "exact",
            }),
          ],
          resource: {
            url: "https://lmnl.im",
            description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
          },
        }),
      })
    })

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
