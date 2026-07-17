import { settleX402Payment } from "@distilled.cloud/coinbase"
import { ChainId } from "crosshatch"
import { FacilitatorApi } from "crosshatch/FacilitatorApi"
import { Effect, Schema as S } from "effect"

import { handler } from "./_common.ts"

export const handleSettle = handler(
  FacilitatorApi,
  "facilitator",
  "settle",
  ({ payload: { paymentPayload, paymentRequirements } }) =>
    settleX402Payment({
      x402Version: 2,
      paymentPayload: paymentPayload as never,
      paymentRequirements: paymentRequirements as never,
    }).pipe(
      Effect.flatMap(({ network, ...rest }) =>
        S.decodeUnknownEffect(ChainId.ChainId)(network).pipe(Effect.map((network) => ({ network, ...rest }) as never)),
      ),
      Effect.orDie,
    ),
)
