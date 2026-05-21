import type { AccountAddress } from "@crosshatch/caip"
import { Required, Requirements } from "@crosshatch/x402"
import { Micros, PaymentContextId, CurrentPaymentMetadata, PaymentMetadata } from "crosshatch"
import { Context, Effect, String } from "effect"

import { BASE_USDC } from "./Micros.ts"

export class PaymentBridge extends Context.Service<
  PaymentBridge,
  {
    readonly recipient: typeof AccountAddress.Type
    readonly take: ({
      required,
      metadata,
    }: {
      readonly required: typeof Required.Required.Type
      readonly metadata: typeof PaymentMetadata.Type
    }) => Effect.Effect<void>
  }
>()("crosshatch/Bridge") {}

export const charge =
  (amount: typeof Micros.Micros.Type) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.gen(function* () {
      const { take, recipient } = yield* PaymentBridge
      const metadata = yield* CurrentPaymentMetadata
      yield* take({
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
        metadata,
      })
    })

export const grouped =
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
  <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    Effect.provideServiceEffect(
      effect,
      CurrentPaymentMetadata,
      Effect.sync(() => ({
        paymentContextId: PaymentContextId.make(crypto.randomUUID()),
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)).trim(),
      })),
    )
