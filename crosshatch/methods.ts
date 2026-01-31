import type { PaymentRequired } from "@x402/core/types"
import { Effect } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { Live } from "./Live.ts"

export const linkState = Effect.gen(function*() {
  const bridge = yield* BridgeClient
  return yield* bridge.status(void 0)
}).pipe(
  Effect.provide(Live),
)

export const unlink = Effect.gen(function*() {
  const bridge = yield* BridgeClient
  return yield* bridge.unlink(void 0)
}).pipe(
  Effect.provide(Live),
)

export const pay = Effect.fn(
  function*(requirement: PaymentRequired) {
    const bridge = yield* BridgeClient
    return yield* bridge.propose({ requirement })
  },
  Effect.provide(Live),
)
