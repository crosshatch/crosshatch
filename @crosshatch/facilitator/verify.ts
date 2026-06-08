import { Requirements, Payload } from "@crosshatch/x402"
import { Effect } from "effect"

import { make } from "./CdpClient.ts"

export const verify = Effect.fn(function* ({
  requirements: paymentRequirements,
  payload: paymentPayload,
}: {
  requirements: typeof Requirements.Requirements.Type
  payload: typeof Payload.Payload.Type
}) {
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
})
