import { Effect } from "effect"

import type { CaAccountId } from "./CaAccountId.ts"
import type { Provider } from "./RampApi.ts"
import { RampClient } from "./RampClient.ts"

export const onramp = Effect.fnUntraced(function* ({
  amount,
  provider,
  recipient,
}: {
  readonly amount: number
  readonly provider: Provider
  readonly recipient: typeof CaAccountId.Type
}) {
  const ramp = yield* RampClient
  return yield* ramp.onramp({ payload: { amount, provider, recipient } })
})
