import { Clock, Context, Effect, Layer, Schema as S } from "effect"
import { KeyValueStore } from "effect/unstable/persistence"

import { Challenge } from "./Schema.ts"

const StoredChallenge = S.Struct({ challenge: Challenge, expiresAt: S.Finite.check(S.isGreaterThan(0)) })

export class ChallengeStore extends Context.Service<
  ChallengeStore,
  {
    readonly issue: (
      entry: typeof StoredChallenge.Type,
    ) => Effect.Effect<void, KeyValueStore.KeyValueStoreError | S.SchemaError>

    readonly get: (
      nonce: string,
    ) => Effect.Effect<typeof Challenge.Type | undefined, KeyValueStore.KeyValueStoreError | S.SchemaError>
  }
>()("crosshatch/Siwx/ChallengeStore") {}

export const layer = Layer.effect(
  ChallengeStore,
  Effect.gen(function* () {
    const store = KeyValueStore.toSchemaStore(
      KeyValueStore.prefix(yield* KeyValueStore.KeyValueStore, "siwx:challenge:"),
      StoredChallenge,
    )

    return {
      issue: (entry) => store.set(entry.challenge.info.nonce, entry),

      get: Effect.fnUntraced(function* (nonce) {
        const entry = yield* store.get(nonce)
        if (entry._tag === "None") {
          return undefined
        }
        if (entry.value.expiresAt <= (yield* Clock.currentTimeMillis)) {
          yield* store.remove(nonce)
          return undefined
        }
        return entry.value.challenge
      }),
    }
  }),
)
