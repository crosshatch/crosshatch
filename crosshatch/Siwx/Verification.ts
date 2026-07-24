import { Array, DateTime, Effect, Schema as S } from "effect"

import { ChallengeStore } from "./ChallengeStore.ts"
import { CHALLENGE_MAX_AGE_MS, Info, type Proof } from "./Schema.ts"
import { VerifyError, type Verifier } from "./Verifier.ts"

export const verifyProof = <const Verifiers extends ReadonlyArray<Verifier>>(...verifiers: Verifiers) =>
  Effect.fnUntraced(
    function* (proof: typeof Proof.Type, requestUrl: URL) {
      const challengeStore = yield* ChallengeStore
      const challenge = yield* challengeStore.peek(proof.nonce)
      if (!challenge) {
        return yield* new VerifyError({})
      }
      if (!S.toEquivalence(Info)(proof, challenge.info)) {
        return yield* new VerifyError({})
      }
      if (challenge.info.uri !== requestUrl.href) {
        return yield* new VerifyError({})
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
        !DateTime.between(issuedAt, { minimum: DateTime.subtractDuration(now, CHALLENGE_MAX_AGE_MS), maximum: now }) ||
        (expirationTime && !DateTime.isLessThan(now, expirationTime)) ||
        (notBefore && !DateTime.isGreaterThanOrEqualTo(now, notBefore)) ||
        !Array.some(challenge.supportedChains, ({ chainId, type }) => chainId === proof.chainId && type === proof.type)
      ) {
        return yield* new VerifyError({})
      }

      const verifier = Array.findFirst(
        verifiers,
        ({ scheme, supportsChainId, type }) =>
          type === proof.type &&
          (!proof.signatureScheme || proof.signatureScheme === scheme) &&
          supportsChainId(proof.chainId),
      )

      if (verifier._tag === "None") {
        return yield* new VerifyError({})
      }

      const identity = yield* verifier.value.verify(proof).pipe(Effect.mapError((cause) => new VerifyError({ cause })))

      yield* challengeStore.consume(proof.nonce).pipe(
        Effect.filterOrFail(
          (s) => s,
          () => new VerifyError({}),
        ),
      )

      return identity
    },
    Effect.catchTags({
      SchemaError: (cause) => new VerifyError({ cause }),
      KeyValueStoreError: ({ cause }) => new VerifyError({ cause }),
    }),
  )
