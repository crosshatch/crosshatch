import { Required, Requirements } from "@crosshatch/x402"
import { Effect, String } from "effect"

import { Micros, BASE_USDC, toX402 } from "../Micros.ts"
import { PaymentBridge } from "./PaymentBridge.ts"
import { CurrentPaymentContext } from "./PaymentContext.ts"

export const charge =
  (amount: typeof Micros.Type) =>
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
              amount: toX402(amount, BASE_USDC),
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
