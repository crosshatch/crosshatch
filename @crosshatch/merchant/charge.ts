import { ASSETS, Amount } from "@crosshatch/assets"
import { required, settle } from "crosshatch"
import { Effect, flow, Option, String } from "effect"

import { Bridge } from "./Bridge.ts"
import { Merchant } from "./Merchant.ts"
import { Trace } from "./Trace.ts"

export const charge = (amount: typeof Amount.Usd.Type) =>
  Effect.fnUntraced(function* (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) {
    const { createPayload } = yield* Bridge
    const traceId = yield* Effect.serviceOption(Trace).pipe(
      Effect.map(
        flow(
          Option.map(({ traceId }) => traceId),
          Option.getOrUndefined,
        ),
      ),
    )
    const { url, pot } = yield* Merchant
    const { payload } = yield* createPayload({
      traceId,
      required: required({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        amount,
        recipient: pot,
        asset: ASSETS.BASE_USDC,
      }),
    })
    return yield* settle({ payload })
  })
