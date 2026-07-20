import { Context, Data, Effect, Layer, type Types } from "effect"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

import type { Builder, CaAccountId } from "../CaAccountId/CaAccountId.ts"
import { builder as eip155Builder } from "../CaAccountId/eip155.ts"
import { builder as solanaBuilder } from "../CaAccountId/solana.ts"
import * as Facilitator from "../Facilitator.ts"
import type { Payload } from "../Payload.ts"
import type { Id } from "./Entitlement.ts"
import { EntitlementStore, layerEntitlementMemory } from "./EntitlementStore.ts"
import { Identity } from "./Identity.ts"

export class EntitlementRecordError extends Data.TaggedError("EntitlementRecordError")<{
  readonly cause?: unknown
}> {}

export class UnsupportedNetworkError extends Data.TaggedError("UnsupportedNetworkError")<{
  readonly network: string
}> {}

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
    return yield* new UnsupportedNetworkError({ network })
  }

  const accountId = yield* builder
    .accountId(network, payer)
    .pipe(Effect.mapError((cause) => new EntitlementRecordError({ cause })))

  return identity.accountId === accountId ? identity.accountId : undefined
})

export const isEntitled = Effect.fnUntraced(function* (id: typeof Id.Type) {
  const identity = yield* Identity
  if (identity === undefined) {
    return false
  }
  const store = yield* EntitlementStore
  return yield* store.has({ id, accountId: identity.accountId })
})

export const record = Effect.fnUntraced(function* ({
  id,
  accountId,
}: {
  readonly id: typeof Id.Type
  readonly accountId: typeof CaAccountId.Type
}) {
  const store = yield* EntitlementStore
  yield* store.record({ id, accountId })
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

export const layerProvideMemory = HttpRouter.middleware<{ readonly provides: EntitlementStore }>()(
  Effect.gen(function* () {
    const store = yield* EntitlementStore
    return (effect: Effect.Effect<HttpServerResponse.HttpServerResponse, Types.unhandled, EntitlementStore>) =>
      Effect.provideService(effect, EntitlementStore, store)
  }),
  { global: true },
).pipe(Layer.provide(layerEntitlementMemory))
