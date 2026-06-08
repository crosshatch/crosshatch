import { ChainIdString } from "@crosshatch/caip"
import { Effect, Schema as S } from "effect"

import { handler } from "../_httpapi_util.ts"
import { Api } from "../Api.ts"
import { make } from "../CdpClient.ts"

export const handleSettle = handler(
  Api,
  "facilitator",
  "settle",
  Effect.fn(function* ({ payload: { paymentPayload, paymentRequirements } }) {
    const client = yield* make({
      host: "api.cdp.coinbase.com",
      path: "/platform/v2/x402/settle",
    })
    const { success, errorReason, errorMessage, payer, transaction, network } = yield* client.settleX402Payment({
      payload: {
        paymentPayload,
        paymentRequirements,
        x402Version: 2,
      } as never, // TODO
    })
    return {
      success,
      errorReason,
      errorMessage,
      payer,
      transaction,
      network: yield* S.decodeUnknownEffect(ChainIdString)(network),
    }
  }, Effect.orDie),
)
