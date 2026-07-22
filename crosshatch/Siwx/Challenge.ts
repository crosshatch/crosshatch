import { Array, Clock, Data, Effect, Encoding, pipe, Schema as S } from "effect"

import { JsonRecord } from "../_util.ts"
import { Random } from "../Crypto/Crypto.ts"
import * as Required from "../Required.ts"
import * as ChallengeStore from "./ChallengeStore.ts"
import { Siwx } from "./Extension.ts"
import { Challenge, CHALLENGE_MAX_AGE_MS, Proof } from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

class NoSuchVerifierError extends Data.TaggedError("NoSuchVerifierError")<{
  readonly cause?: unknown
}> {}

export const issue = Effect.fnUntraced(function* ({
  uri,
  networks,
  verifiers,
  statement,
  expirationSeconds,
}: {
  readonly uri: string
  readonly networks: ReadonlyArray<string>
  readonly verifiers: ReadonlyArray<Verifier>
  readonly statement?: string | undefined
  readonly expirationSeconds?: number | undefined
}) {
  if (expirationSeconds) {
    yield* S.decodeUnknownEffect(S.Finite.check(S.isGreaterThan(0)))(expirationSeconds)
  }
  const { host, href } = yield* S.decodeUnknownEffect(S.URLFromString)(uri)

  const supportedChains = Array.flatMap(verifiers, (verifier) =>
    pipe(
      networks,
      Array.filter(verifier.supportsChainId),
      Array.map((network) => ({ chainId: network, type: verifier.type, signatureScheme: verifier.scheme })),
    ),
  )
  if (!Array.isReadonlyArrayNonEmpty(supportedChains)) {
    return yield* new NoSuchVerifierError({})
  }

  const now = yield* Clock.currentTimeMillis
  const maxExpiresAt = now + CHALLENGE_MAX_AGE_MS
  const expirationTime =
    expirationSeconds ? Math.min(now + expirationSeconds * 1_000, maxExpiresAt) : undefined

  const challenge = {
    info: {
      domain: host,
      uri: href,
      version: "1",
      nonce: Encoding.encodeHex(Random.bytes(16)),
      issuedAt: new Date(now).toISOString(),
      resources: [href],
      ...(expirationTime && { expirationTime: new Date(expirationTime).toISOString() }),
      ...(statement && { statement }),
    },
    supportedChains,
    schema: yield* S.decodeUnknownEffect(JsonRecord)(S.toJsonSchemaDocument(Proof).schema),
  } satisfies typeof Challenge.Type

  yield* ChallengeStore.issue({ challenge, expiresAt: expirationTime ?? maxExpiresAt })

  return challenge
})

export const extend =
  (options: {
    readonly verifiers: ReadonlyArray<Verifier>
    readonly statement?: string | undefined
    readonly expirationSeconds?: number | undefined
    readonly networks?: ReadonlyArray<string> | undefined
  }) =>
  <E, R>(effect: Effect.Effect<Required.Required, E, R>) =>
    Effect.gen(function* () {
      const required = yield* effect
      const uri = yield* Effect.fromNullishOr(required.resource.url).pipe(Effect.orDie)

      const networks =
        options.networks ??
        pipe(
          required.accepts,
          Array.map(({ network }) => network),
          Array.dedupe,
        )

      const challenge = yield* issue({ ...options, uri, networks })
      return yield* Required.extend(Siwx, challenge)(Effect.succeed(required))
    })
