import { Amount, Asset } from "@crosshatch/assets"
import { required, settle } from "crosshatch"
import { Effect, flow, Option, String } from "effect"

import { Bridge } from "./Bridge.ts"
import { Merchant } from "./Merchant.ts"
import { Trace } from "./Trace.ts"

export const charge = ({ amount, asset }: { readonly amount: bigint; readonly asset: Asset.Asset }) =>
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
    const { url, pot: recipient } = yield* Merchant
    const { payload } = yield* createPayload({
      traceId,
      required: required({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        accepts: [
          Asset.requirements({
            amount: Amount.Usd.make(amount),
            recipient,
            asset,
          }),
        ],
      }),
    })
    return yield* settle({ payload })
  })
