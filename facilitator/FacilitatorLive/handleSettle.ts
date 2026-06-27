import { settleX402Payment } from "@distilled.cloud/coinbase"
import { ChainId, Facilitator } from "crosshatch"
import { Effect, Schema as S } from "effect"

import { handler } from "./_common.ts"

export const handleSettle = handler(
  Facilitator.FacilitatorApi,
  "facilitator",
  "settle",
  ({ payload: { paymentPayload, paymentRequirements } }) =>
    settleX402Payment({
      x402Version: 2,
      paymentPayload,
      paymentRequirements,
    }).pipe(
      Effect.flatMap(({ network, ...rest }) =>
        S.decodeUnknownEffect(ChainId.ChainId)(network).pipe(Effect.map((network) => ({ network, ...rest }))),
      ),
      Effect.orDie,
    ),
)
