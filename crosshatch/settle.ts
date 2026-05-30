import { ChainIdString } from "@crosshatch/caip"
import type { Payload } from "@crosshatch/x402"
import { Effect, Schema as S } from "effect"
import * as Boundary from "liminal-util/Boundary"

import { CrosshatchClient } from "./CrosshatchClient.ts"

export class SettlementError extends S.TaggedErrorClass<SettlementError>()("SettlementError", {}) {}

export interface Settlement {
  chainId: typeof ChainIdString.Type
  transaction: string
}

export const settle = Effect.fnUntraced(
  function* ({ payload }: { readonly payload: typeof Payload.Payload.Type }) {
    const chx = yield* CrosshatchClient
    const { accepted: paymentRequirements } = payload
    const response = yield* chx.facilitator
      .settle({
        payload: {
          paymentPayload: payload,
          paymentRequirements,
        },
      })
      .pipe(Effect.catch(() => new SettlementError()))
    if (!response.success) {
      const { errorReason: reason, errorMessage: message } = response
      yield* Effect.logError({ reason, message })
      return yield* new SettlementError()
    }
    const { network: chainId, transaction } = response
    return { chainId, transaction } satisfies Settlement
  },
  Boundary.span("settle", import.meta.url),
)
