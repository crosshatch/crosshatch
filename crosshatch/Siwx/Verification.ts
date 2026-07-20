import { DateTime, Effect, Schema as S } from "effect"

import * as ChallengeStore from "./ChallengeStore.ts"
import { SiwxError } from "./Error.ts"
import { CHALLENGE_MAX_AGE_MS, Info, type Proof } from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

const infoEquivalence = S.toEquivalence(Info)

export const verifyProof = <const Verifiers extends ReadonlyArray<Verifier.Any>>(...verifiers: Verifiers) =>
  Effect.fnUntraced(
    function* (proof: typeof Proof.Type, requestUrl: URL) {
      const challenge = yield* ChallengeStore.get(proof.nonce)
      if (challenge === undefined) {
        return yield* new SiwxError({})
      }

      if (!infoEquivalence(proof, challenge.info)) {
        return yield* new SiwxError({})
      }

      if (challenge.info.uri !== requestUrl.href) {
        return yield* new SiwxError({})
      }

      const { issuedAt, expirationTime, notBefore } = yield* S.decodeUnknownEffect(
        S.Struct({
          issuedAt: S.DateTimeUtcFromString,
          expirationTime: S.DateTimeUtcFromString.pipe(S.optional),
          notBefore: S.DateTimeUtcFromString.pipe(S.optional),
        }),
      )(challenge.info)

      const now = yield* DateTime.now
      if (
        !DateTime.between(issuedAt, {
          minimum: DateTime.subtractDuration(now, CHALLENGE_MAX_AGE_MS),
          maximum: now,
        }) ||
        (expirationTime !== undefined && DateTime.isLessThanOrEqualTo(expirationTime, now)) ||
        (notBefore !== undefined && DateTime.isLessThan(now, notBefore))
      ) {
        return yield* new SiwxError({})
      }

      const verifier = verifiers.find(
        (candidate) => candidate.type === proof.type && candidate.supportsChainId(proof.chainId),
      )
      if (
        verifier === undefined ||
        !challenge.supportedChains.some((entry) => entry.chainId === proof.chainId && entry.type === proof.type)
      ) {
        return yield* new SiwxError({})
      }

      const identity = yield* verifier.verify(proof).pipe(Effect.mapError((cause) => new SiwxError({ cause })))

      yield* ChallengeStore.consume(proof.nonce).pipe(
        Effect.filterOrFail(
          (s) => s,
          () => new SiwxError({}),
        ),
      )

      return identity
    },
    Effect.catchTags({
      SchemaError: (cause) => new SiwxError({ cause }),
      KeyValueStoreError: ({ cause }) => new SiwxError({ cause }),
    }),
  )
