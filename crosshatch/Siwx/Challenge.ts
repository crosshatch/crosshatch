import { Array as A, Clock, Effect, Encoding, pipe, Schema as S } from "effect"

import type { Required } from "../Required.ts"
import * as ChallengeStore from "./ChallengeStore.ts"
import {
  Challenge as ChallengeSchema,
  CHALLENGE_MAX_AGE_MS,
  ChallengeFromJson,
  SIGN_IN_WITH_X,
  Proof,
} from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

const PositiveFiniteSeconds = S.Finite.check(S.isGreaterThan(0))

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
  if (expirationSeconds !== undefined) {
    yield* S.decodeUnknownEffect(PositiveFiniteSeconds)(expirationSeconds)
  }
  const url = yield* S.decodeUnknownEffect(S.URLFromString)(uri)

  const supportedChains = verifiers.flatMap((verifier) =>
    pipe(
      networks,
      A.filter(verifier.supportsChainId),
      A.map((network) => ({ chainId: network, type: verifier.type, signatureScheme: verifier.scheme })),
    ),
  )
  if (!A.isReadonlyArrayNonEmpty(supportedChains)) {
    return yield* Effect.die("siwx: no verifier supports any of the given networks")
  }

  const now = yield* Clock.currentTimeMillis
  const maxExpiresAt = now + CHALLENGE_MAX_AGE_MS
  const expirationTime =
    expirationSeconds === undefined ? undefined : Math.min(now + expirationSeconds * 1_000, maxExpiresAt)

  const schema = yield* S.decodeUnknownEffect(S.Record(S.String, S.Json))(S.toJsonSchemaDocument(Proof).schema)

  const challenge = {
    info: {
      domain: url.host,
      uri: url.href,
      version: "1",
      nonce: Encoding.encodeHex(crypto.getRandomValues(new Uint8Array(16))),
      issuedAt: new Date(now).toISOString(),
      resources: [url.href],
      ...(expirationTime !== undefined && { expirationTime: new Date(expirationTime).toISOString() }),
      ...(statement !== undefined && { statement }),
    },
    supportedChains,
    schema,
  } satisfies typeof ChallengeSchema.Type

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
  (effect: Effect.Effect<Required, unknown, unknown>) =>
    Effect.gen(function* () {
      const { extensions, ...required } = yield* effect
      const uri = yield* Effect.fromNullishOr(required.resource.url).pipe(Effect.orDie)

      const networks =
        options.networks ??
        pipe(
          required.accepts,
          A.map(({ network }) => network),
          A.dedupe,
        )

      return yield* issue({ ...options, uri, networks }).pipe(
        Effect.flatMap(S.encodeEffect(ChallengeFromJson)),
        Effect.map((extension) => ({
          ...required,
          extensions: { ...extensions, [SIGN_IN_WITH_X]: extension },
        })),
      )
    })
