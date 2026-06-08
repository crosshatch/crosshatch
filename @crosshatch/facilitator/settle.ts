import { Requirements, Payload } from "@crosshatch/x402"
import { Effect } from "effect"

import { makeCdpClient } from "../coinbase.ts"
import { mapInternalError } from "../mapInternalError.ts"

export const settle = Effect.fn(function* ({
  requirements: paymentRequirements,
  payload: paymentPayload,
}: {
  requirements: typeof Requirements.Requirements.Type
  payload: typeof Payload.Payload.Type
}) {
  const cdp = yield* makeCdpClient({
    host: "api.cdp.coinbase.com",
    path: "/platform/v2/x402/settle",
  })
  const {
    transaction: tx,
    errorReason,
    errorMessage,
  } = yield* cdp.settleX402Payment({
    payload: {
      x402Version: 2,
      paymentRequirements,
      paymentPayload,
    } as never, // TODO
  })
  return errorReason
    ? ({
        _tag: "Failed",
        message: errorMessage,
        reason: errorReason,
      } as const)
    : ({ _tag: "Settled", tx } as const)
}, mapInternalError)
