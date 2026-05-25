import { ChainIdString } from "@crosshatch/caip"
import type { Payload } from "@crosshatch/x402"
import { Data, Effect } from "effect"
import * as Spanner from "liminal-util/Spanner"

import { CrosshatchClient } from "./CrosshatchClient.ts"

const span = Spanner.make(import.meta.url)

export class SettlementError extends Data.TaggedError("SettlementError")<{
  readonly cause: unknown
}> {}

export interface Settlement {
  chainId: typeof ChainIdString.Type
  transaction: string
}

export const settle = Effect.fnUntraced(function* (payload: typeof Payload.Payload.Type) {
  const chx = yield* CrosshatchClient
  const response = yield* chx.facilitator
    .settle({
      payload: {
        paymentPayload: payload,
        paymentRequirements: payload.accepted,
      },
    })
    .pipe(Effect.catch((cause) => new SettlementError({ cause }).asEffect()))
  if (!response.success) {
    const { errorReason: reason, errorMessage: message } = response
    return yield* new SettlementError({
      cause: { reason, message },
    })
  }
  const { network: chainId, transaction } = response
  return { chainId, transaction } satisfies Settlement
}, span("settle"))
