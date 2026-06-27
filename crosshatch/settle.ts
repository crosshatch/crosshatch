import { Effect, Data } from "effect"
import * as Boundary from "liminal-util/Boundary"

import { ChainId } from "./ChainId.ts"
import { FacilitatorClient } from "./Facilitator/Facilitator.ts"
import { Payload } from "./Payload.ts"

export class SettlementError extends Data.TaggedError("SettlementError")<{
  readonly cause: unknown
}> {}

export interface Settlement {
  chainId: typeof ChainId.Type
  transaction: string
}

export const settle = Effect.fnUntraced(
  function* ({ payload }: { readonly payload: typeof Payload.Type }) {
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
