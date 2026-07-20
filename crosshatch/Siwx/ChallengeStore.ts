import { Clock, Effect, Option, Schema as S } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import { Challenge } from "./Schema.ts"

export interface StoredChallenge {
  readonly challenge: typeof Challenge.Type
  readonly expiresAt: number
}

const StoredChallengeJson = S.Struct({
  challenge: Challenge,
  expiresAt: S.Finite,
})

const store = Effect.map(KeyValueStore.KeyValueStore, (kv) =>
  KeyValueStore.toSchemaStore(KeyValueStore.prefix(kv, "siwx:challenge:"), StoredChallengeJson),
)

export const insert = (entry: StoredChallenge) =>
  Effect.gen(function* () {
    const challenges = yield* store
    const nonce = entry.challenge.info.nonce
    if (yield* challenges.has(nonce)) {
      return false
    }
    yield* challenges.set(nonce, entry)
    return true
  })

export const get = (nonce: string) =>
  Effect.gen(function* () {
    const challenges = yield* store
    const entry = yield* challenges.get(nonce)
    if (Option.isNone(entry)) {
      return undefined
    }
    const now = yield* Clock.currentTimeMillis
    if (entry.value.expiresAt <= now) {
      yield* challenges.remove(nonce)
      return undefined
    }
    return entry.value.challenge
  })

export const consume = (nonce: string) =>
  Effect.gen(function* () {
    const challenges = yield* store
    const entry = yield* challenges.get(nonce)
    if (Option.isNone(entry)) {
      return false
    }
    const now = yield* Clock.currentTimeMillis
    yield* challenges.remove(nonce)
    return entry.value.expiresAt > now
  })
