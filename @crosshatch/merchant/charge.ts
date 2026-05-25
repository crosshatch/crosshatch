import { makeRequired, Micros } from "crosshatch"
import { Effect, Option, String } from "effect"

import { MerchantMetadata } from "./MerchantMetadata.ts"
import { PaymentBridge } from "./PaymentBridge.ts"
import { Trace } from "./Trace.ts"
import { Treasury } from "./Treasury.ts"

export const charge = (amount: typeof Micros.Micros.Type) =>
  Effect.fnUntraced(function* (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) {
    const treasury = yield* Treasury
    const { createPayload } = yield* PaymentBridge
    const trace = yield* Effect.serviceOption(Trace).pipe(Effect.map(Option.getOrUndefined))
    const { url } = yield* MerchantMetadata
    // const { payload } =
    yield* createPayload({
      traceId: trace ? trace.traceId : undefined,
      required: makeRequired({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        amount,
        recipient: treasury,
        asset: Micros.BASE_USDC,
      }),
    })
    // yield* settle(payload)
  })
