import { Asset, required, Micros, settle } from "crosshatch"
import { Effect, flow, Option, String } from "effect"

import { Bridge } from "./Bridge.ts"
import { Merchant } from "./Merchant.ts"
import { Trace } from "./Trace.ts"

export const charge = (amount: typeof Micros.Micros.Type) =>
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
    const { url, treasury } = yield* Merchant
    const { payload } = yield* createPayload({
      traceId,
      required: required({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        amount,
        recipient: treasury,
        asset: Asset.BASE_USDC,
      }),
    })
    return yield* settle({ payload })
  })
