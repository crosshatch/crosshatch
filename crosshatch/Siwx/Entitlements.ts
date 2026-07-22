import { Data, Effect } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import type { CaAccountId } from "../CaAccountId.ts"
import * as Facilitator from "../Facilitator.ts"
import type { Payload } from "../Payload.ts"
import type { EntitlementId } from "./Entitlement.ts"
import { Identity } from "./Identity.ts"

const storeKey = ({
  id,
  accountId,
}: {
  readonly id: typeof EntitlementId.Type
  readonly accountId: typeof CaAccountId.Type
}) => `siwx:entitlement:${JSON.stringify([id, accountId])}`

export class PurchaseError extends Data.TaggedError("PurchaseError")<{
  readonly cause?: unknown
}> {}

export const isEntitled = Effect.fnUntraced(function* (id: typeof EntitlementId.Type) {
  const identity = yield* Identity
  if (!identity) {
    return false
  }
  const store = yield* KeyValueStore.KeyValueStore
  return yield* store.has(storeKey({ id, accountId: identity.accountId }))
})

export const purchase = Effect.fnUntraced(function* ({
  id,
  payload,
}: {
  readonly id: typeof EntitlementId.Type
  readonly payload: Payload
}) {
  const identity = yield* Identity
  if (!identity) {
    return yield* new PurchaseError({})
  }
  if (identity.chainId !== payload.accepted.network) {
    return yield* new PurchaseError({})
  }

  const verification = yield* Facilitator.verify({ payload })
  if (!verification.payer) {
    return yield* new PurchaseError({})
  }
  if (identity.address.toLowerCase() !== verification.payer.toLowerCase()) {
    return yield* new PurchaseError({})
  }

  const settlement = yield* Facilitator.settle({ payload })
  if (!settlement.success || !settlement.payer) {
    return yield* new PurchaseError({})
  }

  const store = yield* KeyValueStore.KeyValueStore
  yield* store.set(storeKey({ id, accountId: identity.accountId }), "1")
  return settlement
})
