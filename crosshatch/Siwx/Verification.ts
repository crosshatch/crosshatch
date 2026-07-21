import { DateTime, Effect, Schema as S } from "effect"

import * as ChallengeStore from "./ChallengeStore.ts"
import { ProofRejected } from "./Error.ts"
import { CHALLENGE_MAX_AGE_MS, Info, type Proof } from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

export const verifyProof = <const Verifiers extends ReadonlyArray<Verifier.Any>>(...verifiers: Verifiers) =>
  Effect.fnUntraced(
    function* (proof: typeof Proof.Type, requestUrl: URL) {
      const challenge = yield* ChallengeStore.peek(proof.nonce)
      if (challenge === undefined) {
        return yield* new ProofRejected({ reason: "unknown-nonce" })
      }

      if (!S.toEquivalence(Info)(proof, challenge.info)) {
        return yield* new ProofRejected({ reason: "challenge-mismatch" })
      }

      if (challenge.info.uri !== requestUrl.href) {
        return yield* new ProofRejected({ reason: "uri-mismatch" })
      }

      const { issuedAt, expirationTime, notBefore } = yield* S.decodeUnknownEffect(
        S.Struct({
          issuedAt: S.DateTimeUtcFromString,
          expirationTime: S.DateTimeUtcFromString.pipe(S.optional),
          notBefore: S.DateTimeUtcFromString.pipe(S.optional),
        }),
      )(challenge.info)

      const now = yield* DateTime.now
      const fresh = DateTime.between(issuedAt, {
        minimum: DateTime.subtractDuration(now, CHALLENGE_MAX_AGE_MS),
        maximum: now,
      })
      if (!fresh) {
        return yield* new ProofRejected({ reason: "stale" })
      }
      const unexpired = expirationTime === undefined || DateTime.isLessThan(now, expirationTime)
      if (!unexpired) {
        return yield* new ProofRejected({ reason: "expired" })
      }
      const started = notBefore === undefined || DateTime.isGreaterThanOrEqualTo(now, notBefore)
      if (!started) {
        return yield* new ProofRejected({ reason: "not-yet-valid" })
      }

      if (!challenge.supportedChains.some(({ chainId, type }) => chainId === proof.chainId && type === proof.type)) {
        return yield* new ProofRejected({ reason: "unsupported-chain" })
      }

      const verifier = verifiers.find(
        (candidate) => candidate.type === proof.type && candidate.supportsChainId(proof.chainId),
      )
      if (verifier === undefined) {
        return yield* new ProofRejected({ reason: "unsupported-chain" })
      }

      const identity = yield* verifier
        .verify(proof)
        .pipe(Effect.mapError((cause) => new ProofRejected({ reason: "invalid-signature", cause })))

      yield* ChallengeStore.take(proof.nonce).pipe(
        Effect.filterOrFail(
          (s) => s,
          () => new ProofRejected({ reason: "unknown-nonce" }),
        ),
      )

      return identity
    },
    Effect.catchTag("SchemaError", (cause) => new ProofRejected({ reason: "malformed-proof", cause })),
  )
