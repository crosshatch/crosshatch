import { handler } from "@crosshatch/util/httpapi"
import { FacilitatorApi } from "@crosshatch/x402"
import { Effect } from "effect"

import { make } from "../CdpClient.ts"

export const handleVerify = handler(
  FacilitatorApi,
  "facilitator",
  "verify",
  Effect.fn(function* ({ payload: { paymentPayload, paymentRequirements } }) {
    const client = yield* make({
      host: "api.cdp.coinbase.com",
      path: "/platform/v2/x402/verify",
    })
    return yield* client.verifyX402Payment({
      payload: {
        x402Version: 2,
        paymentRequirements,
        paymentPayload,
      } as never, // TODO
    })
  }, Effect.orDie),
)
