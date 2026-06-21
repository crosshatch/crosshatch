import { settleX402Payment } from "@distilled.cloud/coinbase"
import { ChainIdString } from "crosshatch/Ca"
import { FacilitatorApi } from "crosshatch/X402"
import { Effect, Schema as S } from "effect"

import { handler } from "./_common.ts"

export const handleSettle = handler(
  FacilitatorApi,
  "facilitator",
  "settle",
  ({ payload: { paymentPayload, paymentRequirements } }) =>
    settleX402Payment({
      x402Version: 2,
      paymentPayload,
      paymentRequirements,
    }).pipe(
      Effect.flatMap(({ network, ...rest }) =>
        S.decodeUnknownEffect(ChainIdString)(network).pipe(Effect.map((network) => ({ network, ...rest }))),
      ),
      Effect.orDie,
    ),
)
