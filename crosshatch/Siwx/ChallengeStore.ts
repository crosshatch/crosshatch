import { Clock, Context, Data, Effect, Layer, Schema as S } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import { Challenge } from "./Schema.ts"

export class ChallengeStoreError extends Data.TaggedError("ChallengeStoreError")<{
  readonly operation: "ChallengeStore.insert" | "ChallengeStore.get" | "ChallengeStore.consume"
  readonly cause?: unknown
}> {}

export interface StoredChallenge {
  readonly challenge: typeof Challenge.Type
  readonly expiresAt: number
}

const StoredChallengeJson = S.Struct({
  challenge: Challenge,
  expiresAt: S.Finite,
})

export const StoredChallengeFromJson = S.fromJsonString(S.toCodecJson(StoredChallengeJson))

export class ChallengeStore extends Context.Service<
  ChallengeStore,
  {
    readonly insert: (entry: StoredChallenge) => Effect.Effect<boolean, ChallengeStoreError>
    readonly get: (nonce: string) => Effect.Effect<typeof Challenge.Type | undefined, ChallengeStoreError>
    readonly consume: (nonce: string) => Effect.Effect<boolean, ChallengeStoreError>
  }
>()("crosshatch/Siwx/ChallengeStore") {}

export const layerChallengeKeyValueStore = (options?: { readonly prefix?: string | undefined }) =>
  Layer.effect(
    ChallengeStore,
    Effect.gen(function* () {
      const store = yield* KeyValueStore.KeyValueStore
      const prefix = options?.prefix ?? "siwx:challenge:"
      const key = (nonce: string) => `${prefix}${nonce}`

      return {
        insert: (entry) =>
          Effect.gen(function* () {
            const k = key(entry.challenge.info.nonce)
            if (yield* store.has(k)) {
              return false
            }
            yield* store.set(k, yield* S.encodeEffect(StoredChallengeFromJson)(entry))
            return true
          }).pipe(Effect.mapError((cause) => new ChallengeStoreError({ operation: "ChallengeStore.insert", cause }))),

        get: (nonce) =>
          Effect.gen(function* () {
            const raw = yield* store.get(key(nonce))
            if (raw === undefined) {
              return undefined
            }
            const entry = yield* S.decodeUnknownEffect(StoredChallengeFromJson)(raw)
            const now = yield* Clock.currentTimeMillis
            if (entry.expiresAt <= now) {
              yield* store.remove(key(nonce))
              return undefined
            }
            return entry.challenge
          }).pipe(Effect.mapError((cause) => new ChallengeStoreError({ operation: "ChallengeStore.get", cause }))),

        consume: (nonce) =>
          Effect.gen(function* () {
            const k = key(nonce)
            const raw = yield* store.get(k)
            if (raw === undefined) {
              return false
            }
            const entry = yield* S.decodeUnknownEffect(StoredChallengeFromJson)(raw)
            const now = yield* Clock.currentTimeMillis
            yield* store.remove(k)
            return entry.expiresAt > now
          }).pipe(Effect.mapError((cause) => new ChallengeStoreError({ operation: "ChallengeStore.consume", cause }))),
      }
    }),
  )

export const layerChallengeMemory = layerChallengeKeyValueStore().pipe(Layer.provide(KeyValueStore.layerMemory))
