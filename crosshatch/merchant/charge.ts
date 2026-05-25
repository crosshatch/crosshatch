import { Context, Effect, Option, String } from "effect"

import { makeRequired } from "../makeRequired.ts"
import { BASE_USDC, type Micros } from "../Micros.ts"
import { Treasury } from "../Treasury.ts"
import { MerchantMetadata } from "./MerchantMetadata.ts"
import { PaymentBridge } from "./PaymentBridge.ts"

export class TraceId extends Context.Service<TraceId, string>()("crosshatch/TraceId") {}

export const provideChargeGroup =
  (title: string) =>
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
    Effect.fnUntraced(function* <A, E, R>(effect: Effect.Effect<A, E, R>) {
      const { createTrace } = yield* PaymentBridge
      const traceId = yield* Effect.currentSpan.pipe(
        Effect.map(({ traceId }) => traceId),
        Effect.catchTag("NoSuchElementError", () => Effect.succeed(undefined)),
      )
      if (traceId) {
        yield* createTrace({
          title,
          traceId,
          description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        })
      }
      return yield* Effect.provideService(effect, TraceId, traceId)
    })

export const charge = (amount: typeof Micros.Type) =>
  Effect.fnUntraced(function* (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) {
    const treasury = yield* Treasury
    const { createPayload } = yield* PaymentBridge
    const traceId = yield* Effect.serviceOption(TraceId).pipe(Effect.map(Option.getOrUndefined))
    const { url } = yield* MerchantMetadata
    // const { payload } =
    yield* createPayload({
      traceId,
      required: makeRequired({
        url,
        description: String.stripMargin(globalThis.String.raw(template, ...substitutions)),
        amount,
        recipient: treasury,
        asset: BASE_USDC,
      }),
    })
    // yield* settle(payload)
  })
