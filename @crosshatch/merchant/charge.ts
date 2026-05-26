import { makeRequired, Micros, settle } from "crosshatch"
import { Effect, flow, Option, String } from "effect"

import { Merchant } from "./Merchant.ts"
import { PaymentBridge } from "./PaymentBridge.ts"
import { Trace } from "./Trace.ts"

export const charge = (amount: typeof Micros.Micros.Type) =>
  Effect.fnUntraced(function* (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) {
    const { createPayload } = yield* PaymentBridge
    const traceId = yield* Effect.serviceOption(Trace).pipe(
      Effect.map(
        flow(
          Option.map(({ traceId }) => traceId),
          Option.getOrUndefined,
        ),
      ),
    )
    const { url, treasury } = yield* Merchant
    const { payload } = yield* createPayload({
      traceId,
      required: makeRequired({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        amount,
        recipient: treasury,
        asset: Micros.BASE_USDC,
      }),
    })
    return yield* settle({ payload })
  })
