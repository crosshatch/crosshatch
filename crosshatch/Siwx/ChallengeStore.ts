import { Clock, Effect, Option, Schema as S } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import { Challenge } from "./Schema.ts"

export interface StoredChallenge {
  readonly challenge: typeof Challenge.Type
  readonly expiresAt: number
}

const store = Effect.map(KeyValueStore.KeyValueStore, (kv) =>
  KeyValueStore.toSchemaStore(
    KeyValueStore.prefix(kv, "siwx:challenge:"),
    S.Struct({
      challenge: Challenge,
      expiresAt: S.Finite,
    }),
  ),
)

export const issue = (entry: StoredChallenge) =>
  Effect.gen(function* () {
    const challenges = yield* store
    yield* challenges.set(entry.challenge.info.nonce, entry)
  })

export const peek = (nonce: string) =>
  Effect.gen(function* () {
    const challenges = yield* store
    const entry = yield* challenges.get(nonce)
    return Option.isNone(entry) ? undefined : entry.value.challenge
  })

export const take = (nonce: string) =>
  Effect.gen(function* () {
    const challenges = yield* store
    const entry = yield* challenges.get(nonce)
    if (Option.isNone(entry)) {
      return false
    }
    yield* challenges.remove(nonce)
    return entry.value.expiresAt > (yield* Clock.currentTimeMillis)
  })
