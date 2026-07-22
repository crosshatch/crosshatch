// TODO: Is using the KeyValueStore interface preferable over a custom Context.Service that exposes the exact methods needed? (something similar to Invoices for example).

import { Clock, Effect, Schema as S } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import { Challenge } from "./Schema.ts"

const StoredChallenge = S.Struct({ challenge: Challenge, expiresAt: S.Finite.check(S.isGreaterThan(0)) })

const store = Effect.map(KeyValueStore.KeyValueStore, (kv) =>
  KeyValueStore.toSchemaStore(KeyValueStore.prefix(kv, "siwx:challenge:"), StoredChallenge),
)

export const issue = (entry: typeof StoredChallenge.Type) =>
  store.pipe(Effect.flatMap((challenges) => challenges.set(entry.challenge.info.nonce, entry)))

export const peek = (nonce: string) =>
  store.pipe(
    Effect.flatMap(({ get }) => get(nonce)),
    Effect.map((entry) => (entry._tag === "None" ? undefined : entry.value.challenge)),
  )

export const take = (nonce: string) =>
  Effect.gen(function* () {
    const challenges = yield* store
    const entry = yield* challenges.get(nonce)
    if (entry._tag === "None") {
      return false
    }
    yield* challenges.remove(nonce)
    return entry.value.expiresAt > (yield* Clock.currentTimeMillis)
  })
