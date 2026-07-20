import { Context, Data, Effect, Layer } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import type { CaAccountId } from "../CaAccountId.ts"
import type { Id } from "./Entitlement.ts"

export class EntitlementStoreError extends Data.TaggedError("EntitlementStoreError")<{
  readonly operation: "EntitlementStore.has" | "EntitlementStore.record"
  readonly cause?: unknown
}> {}

export interface EntitlementRecord {
  readonly id: typeof Id.Type
  readonly accountId: typeof CaAccountId.Type
}

export class EntitlementStore extends Context.Service<
  EntitlementStore,
  {
    readonly has: (entitlement: EntitlementRecord) => Effect.Effect<boolean, EntitlementStoreError>
    readonly record: (entitlement: EntitlementRecord) => Effect.Effect<void, EntitlementStoreError>
  }
>()("crosshatch/Siwx/EntitlementStore") {}

export const layerEntitlementKeyValueStore = (options?: { readonly prefix?: string | undefined }) =>
  Layer.effect(
    EntitlementStore,
    Effect.gen(function* () {
      const store = yield* KeyValueStore.KeyValueStore
      const prefix = options?.prefix ?? "siwx:entitlement:"
      const key = ({ id, accountId }: EntitlementRecord) => `${prefix}${JSON.stringify([id, accountId])}`

      return {
        has: (entitlement) =>
          store
            .has(key(entitlement))
            .pipe(Effect.mapError((cause) => new EntitlementStoreError({ operation: "EntitlementStore.has", cause }))),
        record: (entitlement) =>
          store
            .set(key(entitlement), "1")
            .pipe(
              Effect.mapError((cause) => new EntitlementStoreError({ operation: "EntitlementStore.record", cause })),
            ),
      }
    }),
  )

export const layerEntitlementMemory = layerEntitlementKeyValueStore().pipe(Layer.provide(KeyValueStore.layerMemory))
