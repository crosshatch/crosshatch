import { DateTime, Effect, Schema as S } from "effect"

import { ChallengeStore } from "./ChallengeStore.ts"
import { SiwxError } from "./Error.ts"
import type { AuthenticatedIdentity } from "./Identity.ts"
import { CHALLENGE_MAX_AGE_MS, Info, type Proof } from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

const Timestamps = S.Struct({
  issuedAt: S.DateTimeUtcFromString,
  expirationTime: S.DateTimeUtcFromString.pipe(S.optional),
  notBefore: S.DateTimeUtcFromString.pipe(S.optional),
})

export const verifyProof = <const Verifiers extends ReadonlyArray<Verifier.Any>>(
  ...verifiers: Verifiers
): ((
  proof: typeof Proof.Type,
  requestUrl: URL,
) => Effect.Effect<AuthenticatedIdentity, SiwxError, ChallengeStore | Verifier.Context<Verifiers[number]>>) =>
  Effect.fnUntraced(function* (proof: typeof Proof.Type, requestUrl: URL) {
    const store = yield* ChallengeStore
    const challenge = yield* store.get(proof.nonce).pipe(Effect.mapError((cause) => new SiwxError({ cause })))
    if (challenge === undefined) {
      return yield* new SiwxError({})
    }

    const info = yield* S.decodeUnknownEffect(Info)(proof).pipe(
      Effect.mapError((cause) => new SiwxError({ cause })),
    )
    if (!S.toEquivalence(Info)(info, challenge.info)) {
      return yield* new SiwxError({})
    }

    const uri = yield* S.decodeUnknownEffect(S.URLFromString)(challenge.info.uri).pipe(
      Effect.mapError((cause) => new SiwxError({ cause })),
    )
    if (uri.href !== requestUrl.href) {
      return yield* new SiwxError({})
    }

    const { issuedAt, expirationTime, notBefore } = yield* S.decodeUnknownEffect(Timestamps)(proof).pipe(
      Effect.mapError((cause) => new SiwxError({ cause })),
    )
    const now = yield* DateTime.now
    const timely =
      DateTime.between(issuedAt, {
        minimum: DateTime.subtractDuration(now, CHALLENGE_MAX_AGE_MS),
        maximum: now,
      }) &&
      (expirationTime === undefined || DateTime.isLessThan(now, expirationTime)) &&
      (notBefore === undefined || DateTime.isGreaterThanOrEqualTo(now, notBefore))
    if (!timely) {
      return yield* new SiwxError({})
    }

    const offered = challenge.supportedChains.some(
      (entry) => entry.chainId === proof.chainId && entry.type === proof.type,
    )
    const verifier = verifiers.find(
      (candidate) => candidate.type === proof.type && candidate.supportsChainId(proof.chainId),
    )
    if (!offered || verifier === undefined) {
      return yield* new SiwxError({})
    }

    const identity = yield* verifier.verify(proof).pipe(Effect.mapError((cause) => new SiwxError({ cause })))

    const consumed = yield* store
      .consume(proof.nonce)
      .pipe(Effect.mapError((cause) => new SiwxError({ cause })))
    if (!consumed) {
      return yield* new SiwxError({})
    }

    return identity
  })
