import { Effect } from "effect"
import { BridgeClient } from "./BridgeClient.ts"
import { Live } from "./Live.ts"
import type { PaymentRequired } from "./X402/schemas.ts"

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
  function*(required: typeof PaymentRequired.Type) {
    const bridge = yield* BridgeClient
    return yield* bridge.propose({ required })
  },
  Effect.provide(Live),
)
