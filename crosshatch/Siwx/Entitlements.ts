import { Effect } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import type { CaAccountId } from "../CaAccountId.ts"
import * as Facilitator from "../Facilitator.ts"
import type { Payload } from "../Payload.ts"
import type { Id } from "./Entitlement.ts"
import { Identity } from "./Identity.ts"

const key = ({ id, accountId }: { readonly id: typeof Id.Type; readonly accountId: typeof CaAccountId.Type }) =>
  `siwx:entitlement:${JSON.stringify([id, accountId])}`

export const isEntitled = Effect.fnUntraced(function* (id: typeof Id.Type) {
  const identity = yield* Identity
  if (identity === undefined) {
    return false
  }
  const store = yield* KeyValueStore.KeyValueStore
  return yield* store.has(key({ id, accountId: identity.accountId }))
})

export const purchase = Effect.fnUntraced(function* ({
  id,
  payload,
}: {
  readonly id: typeof Id.Type
  readonly payload: Payload
}) {
  const identity = yield* Identity
  if (identity === undefined || identity.chainId !== payload.accepted.network) {
    return undefined
  }

  const verification = yield* Facilitator.verify({ payload })
  if (verification.payer === undefined || identity.address.toLowerCase() !== verification.payer.toLowerCase()) {
    return undefined
  }

  const settlement = yield* Facilitator.settle({ payload })
  if (!settlement.success || settlement.payer === undefined) {
    return undefined
  }

  const store = yield* KeyValueStore.KeyValueStore
  yield* store.set(key({ id, accountId: identity.accountId }), "1")
  return settlement
})
