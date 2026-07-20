import { Array as A, Clock, Data, Effect, Encoding, pipe, Schema as S } from "effect"

import type { Required } from "../Required.ts"
import { ChallengeStore } from "./ChallengeStore.ts"
import {
  Challenge as ChallengeSchema,
  CHALLENGE_MAX_AGE_MS,
  ChallengeFromJson,
  proofSchema,
  SIGN_IN_WITH_X,
} from "./Schema.ts"
import type { Verifier } from "./Verifier.ts"

export class ChallengeError extends Data.TaggedError("ChallengeError")<{ readonly cause?: unknown }> {}

export class NoSupportedChainsError extends Data.TaggedError("NoSupportedChainsError")<{
  readonly networks: ReadonlyArray<string>
}> {}

export class ChallengeExistsError extends Data.TaggedError("ChallengeExistsError")<{ readonly nonce: string }> {}

export class NoResourceUrlError extends Data.TaggedError("NoResourceUrlError")<{}> {}

const PositiveFiniteSeconds = S.Finite.check(S.isGreaterThan(0))

export const make = Effect.fnUntraced(
  function* ({
    uri,
    networks,
    verifiers,
    statement,
    expirationSeconds,
  }: {
    readonly uri: string
    readonly networks: ReadonlyArray<string>
    readonly verifiers: ReadonlyArray<Verifier.Any>
    readonly statement?: string | undefined
    readonly expirationSeconds?: number | undefined
  }) {
    if (expirationSeconds !== undefined) {
      yield* S.decodeUnknownEffect(PositiveFiniteSeconds)(expirationSeconds)
    }
    const url = yield* S.decodeUnknownEffect(S.URLFromString)(uri)

    const supportedChains = networks.flatMap((network) =>
      verifiers.flatMap((verifier) =>
        verifier.supportsChainId(network)
          ? [{ chainId: network, type: verifier.type, signatureScheme: verifier.scheme }]
          : [],
      ),
    )
    if (!A.isReadonlyArrayNonEmpty(supportedChains)) {
      return yield* new NoSupportedChainsError({ networks })
    }

    const now = yield* Clock.currentTimeMillis
    const maxExpiresAt = now + CHALLENGE_MAX_AGE_MS
    const expirationTime =
      expirationSeconds === undefined ? undefined : Math.min(now + expirationSeconds * 1_000, maxExpiresAt)

    const challenge = {
      info: {
        domain: url.host,
        uri: url.href,
        version: "1" as const,
        nonce: Encoding.encodeHex(crypto.getRandomValues(new Uint8Array(16))),
        issuedAt: new Date(now).toISOString(),
        resources: [url.href],
        ...(expirationTime !== undefined && { expirationTime: new Date(expirationTime).toISOString() }),
        ...(statement !== undefined && { statement }),
      },
      supportedChains,
      schema: proofSchema,
    } satisfies typeof ChallengeSchema.Type

    const inserted = yield* ChallengeStore.pipe(
      Effect.flatMap(({ insert }) => insert({ challenge, expiresAt: expirationTime ?? maxExpiresAt })),
    )
    if (!inserted) {
      return yield* new ChallengeExistsError({ nonce: challenge.info.nonce })
    }
    return challenge
  },
  Effect.mapError((cause) => new ChallengeError({ cause })),
)

export const extend =
  (options: {
    readonly verifiers: ReadonlyArray<Verifier.Any>
    readonly statement?: string | undefined
    readonly expirationSeconds?: number | undefined
    readonly networks?: ReadonlyArray<string> | undefined
  }) =>
  <E, R>(effect: Effect.Effect<Required, E, R>) =>
    Effect.gen(function* () {
      const required = yield* effect
      const uri = yield* Effect.fromNullishOr(required.resource.url).pipe(
        Effect.catchTag("NoSuchElementError", () => new NoResourceUrlError()),
      )
      const networks =
        options.networks ??
        pipe(
          required.accepts,
          A.map(({ network }) => network),
          A.dedupe,
        )
      const challenge = yield* make({ ...options, uri, networks })
      const extension = yield* S.encodeEffect(ChallengeFromJson)(challenge).pipe(
        Effect.mapError((cause) => new ChallengeError({ cause })),
      )
      return {
        ...required,
        extensions: { ...required.extensions, [SIGN_IN_WITH_X]: extension },
      }
    })
