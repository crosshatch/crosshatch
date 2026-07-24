import { Context, Data, Effect, Layer } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import type { CaAccountId } from "../CaAccountId.ts"
import * as Facilitator from "../Facilitator.ts"
import { SettleResponse } from "../FacilitatorApi/SettleEndpoint.ts"
import type { Payload } from "../Payload.ts"
import type { EntitlementId } from "./Entitlement.ts"
import { Identity } from "./Identity.ts"

export class PurchaseError extends Data.TaggedError("PurchaseError")<{ readonly cause?: unknown }> {}

export class Entitlements extends Context.Service<
  Entitlements,
  {
    readonly isEntitled: (id: typeof EntitlementId.Type) => Effect.Effect<boolean, KeyValueStore.KeyValueStoreError>

    readonly purchase: (args: {
      readonly id: typeof EntitlementId.Type
      readonly payload: Payload
    }) => Effect.Effect<
      Extract<typeof SettleResponse.Type, { readonly success: true }>,
      PurchaseError,
      Facilitator.Facilitator
    >
  }
>()("crosshatch/Siwx/Entitlements") {}

const entitlementKey = (id: typeof EntitlementId.Type, accountId: typeof CaAccountId.Type) =>
  `siwx:entitlement:${JSON.stringify([id, accountId])}`

export const layer = Layer.effect(
  Entitlements,
  Effect.gen(function* () {
    const store = KeyValueStore.prefix(yield* KeyValueStore.KeyValueStore, "siwx:entitlement:")
    return {
      isEntitled: Effect.fnUntraced(function* (id) {
        const identity = yield* Identity
        if (!identity) {
          return false
        }
        return yield* store.has(entitlementKey(id, identity.accountId))
      }),

      purchase: Effect.fnUntraced(
        function* ({ id, payload }) {
          const identity = yield* Identity
          if (!identity) {
            return yield* new PurchaseError({})
          }
          if (identity.chainId !== payload.accepted.network) {
            return yield* new PurchaseError({})
          }

          const verification = yield* Facilitator.verify({ payload }).pipe(
            Effect.mapError((cause) => new PurchaseError({ cause })),
          )
          if (!verification.payer) {
            return yield* new PurchaseError({})
          }
          if (identity.address.toLowerCase() !== verification.payer.toLowerCase()) {
            return yield* new PurchaseError({})
          }

          const settlement = yield* Facilitator.settle({ payload }).pipe(
            Effect.mapError((cause) => new PurchaseError({ cause })),
          )
          if (!settlement.payer) {
            return yield* new PurchaseError({})
          }

          yield* store.set(entitlementKey(id, identity.accountId), "1")
          return settlement
        },
        Effect.catchTags({
          KeyValueStoreError: ({ cause }) => new PurchaseError({ cause }),
        }),
      ),
    }
  }),
)
