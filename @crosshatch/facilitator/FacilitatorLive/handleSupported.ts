import { Effect } from "effect"

import { handler } from "../_httpapi_util.ts"
import { Api } from "../Api.ts"
import { make } from "../CdpClient.ts"

export const handleSupported = handler(
  Api,
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
