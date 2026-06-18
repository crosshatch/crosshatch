import { ChainIdString } from "@crosshatch/caip"
import { type Payload, FacilitatorClient } from "@crosshatch/x402"
import { Effect, Data } from "effect"
import * as Boundary from "liminal-util/Boundary"

export class SettlementError extends Data.TaggedError("SettlementError")<{
  readonly cause: unknown
}> {}

export interface Settlement {
  chainId: typeof ChainIdString.Type
  transaction: string
}

export const settle = Effect.fnUntraced(
  function* ({ payload }: { readonly payload: typeof Payload.Payload.Type }) {
    const facilitator = yield* FacilitatorClient.getOrDefault
    const { accepted: paymentRequirements } = payload
    const response = yield* facilitator
      .settle({
        payload: {
          paymentPayload: payload,
          paymentRequirements,
        },
      })
      .pipe(Effect.mapError((cause) => new SettlementError({ cause })))
    if (!response.success) {
      const { errorReason: reason, errorMessage: message } = response
      yield* Effect.logError({ reason, message })
      return yield* new SettlementError({ cause: response })
    }
    const { network: chainId, transaction } = response
    return { chainId, transaction } satisfies Settlement
  },
  Boundary.span("settle", import.meta.url),
)
