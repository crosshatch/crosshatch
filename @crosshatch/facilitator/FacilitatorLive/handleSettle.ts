import { ChainIdString } from "@crosshatch/caip"
import { handler } from "@crosshatch/util/httpapi"
import { FacilitatorApi } from "@crosshatch/x402"
import { settleX402Payment } from "@distilled.cloud/coinbase"
import { Effect, Schema as S } from "effect"

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
