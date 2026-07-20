import { Context, Effect } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import type { Builder, CaAccountId } from "../CaAccountId/CaAccountId.ts"
import { builder as eip155Builder } from "../CaAccountId/eip155.ts"
import { builder as solanaBuilder } from "../CaAccountId/solana.ts"
import * as Facilitator from "../Facilitator.ts"
import type { Payload } from "../Payload.ts"
import type { Id } from "./Entitlement.ts"
import { SiwxError } from "./Error.ts"
import { Identity } from "./Identity.ts"

const key = ({ id, accountId }: { readonly id: typeof Id.Type; readonly accountId: typeof CaAccountId.Type }) =>
  `siwx:entitlement:${JSON.stringify([id, accountId])}`

export class Builders extends Context.Reference<ReadonlyArray<Builder>>("crosshatch/Siwx/Builders", {
  defaultValue: () => [eip155Builder, solanaBuilder],
}) {}

export const accountIdIfOwner = Effect.fnUntraced(function* (network: string, payer: string) {
  const identity = yield* Identity
  if (identity === undefined) {
    return undefined
  }

  const builders = yield* Builders
  const builder = builders.find((candidate) => candidate.supports(network))
  if (builder === undefined) {
    return yield* new SiwxError({})
  }

  const accountId = yield* builder.accountId(network, payer)

  return identity.accountId === accountId ? identity.accountId : undefined
})

export const isEntitled = Effect.fnUntraced(function* (id: typeof Id.Type) {
  const identity = yield* Identity
  if (identity === undefined) {
    return false
  }
  const store = yield* KeyValueStore.KeyValueStore
  return yield* store.has(key({ id, accountId: identity.accountId }))
})

export const record = Effect.fnUntraced(function* ({
  id,
  accountId,
}: {
  readonly id: typeof Id.Type
  readonly accountId: typeof CaAccountId.Type
}) {
  const store = yield* KeyValueStore.KeyValueStore
  yield* store.set(key({ id, accountId }), "1")
})

export const purchase = Effect.fnUntraced(function* ({
  id,
  payload,
}: {
  readonly id: typeof Id.Type
  readonly payload: Payload
}) {
  const verification = yield* Facilitator.verify({ payload })
  if (verification.payer === undefined) {
    return undefined
  }

  const accountId = yield* accountIdIfOwner(payload.accepted.network, verification.payer)
  if (accountId === undefined) {
    return undefined
  }

  const settlement = yield* Facilitator.settle({ payload })
  if (!settlement.success || settlement.payer === undefined) {
    return undefined
  }

  yield* record({ id, accountId }).pipe(
    Effect.tapError((cause) =>
      Effect.logError("siwx.entitlement.orphaned_payment").pipe(
        Effect.annotateLogs({
          id,
          accountId,
          network: settlement.network,
          payer: settlement.payer,
          cause: String(cause),
        }),
      ),
    ),
  )
  return settlement
})
