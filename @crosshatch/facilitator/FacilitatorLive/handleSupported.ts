import { handler } from "@crosshatch/util/httpapi"
import { FacilitatorApi } from "@crosshatch/x402"
import { Effect } from "effect"

import { make } from "../CdpClient.ts"

export const handleSupported = handler(
  FacilitatorApi,
  "facilitator",
  "supported",
  Effect.fn(function* () {
    const cdp = yield* make({
      host: "api.cdp.coinbase.com",
      path: "/platform/v2/x402/supported",
    })
    return (yield* cdp.supportedX402PaymentKinds({})) as never // TODO
  }, Effect.orDie),
)
