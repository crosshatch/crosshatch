import { Array as A, Effect, Option, Schema as S } from "effect"

import { Accept } from "../Accept.ts"
import { ChainId } from "../ChainId.ts"
import { ResolverError, type Resolver } from "../ChxHttp/Resolver.ts"
import type { Prover } from "./Prover.ts"
import { ChallengeFromJson, ProofFromBase64JsonString, SIGN_IN_WITH_X } from "./Schema.ts"

export const resolver = <const Provers extends ReadonlyArray<Prover.Any>>(
  ...provers: Provers
): Resolver<Prover.Context<Provers[number]>> =>
  Effect.fnUntraced(
    function* ({ request, required }) {
      const challengeJson = required.extensions?.[SIGN_IN_WITH_X]
      if (challengeJson === undefined) {
        return
      }

      const requestUrl = yield* S.decodeUnknownEffect(S.URLFromString)(request.url)

      const challenge = yield* S.decodeUnknownEffect(ChallengeFromJson)(challengeJson)
      const challengeUri = URL.parse(challenge.info.uri)
      if (challenge.info.domain !== requestUrl.host || challengeUri?.href !== requestUrl.href) {
        return
      }

      const candidates = A.flatMap(challenge.supportedChains, (entry) =>
        A.findFirst(provers, (prover) => prover(challenge.info, entry)).pipe(
          Option.map((sign) => ({ entry, sign })),
          A.fromOption,
        ),
      )

      const accept = yield* Effect.serviceOption(Accept)
      const paymentChain = Option.isSome(accept)
        ? yield* accept.value({ required }).pipe(
            Effect.map(({ chainId }) => chainId),
            Effect.option,
          )
        : Option.none<typeof ChainId.Type>()

      const candidate = Option.orElse(
        Option.flatMap(paymentChain, (chainId) => A.findFirst(candidates, ({ entry }) => entry.chainId === chainId)),
        () => A.head(candidates),
      )

      if (Option.isNone(candidate)) {
        return
      }

      const header = yield* candidate.value.sign.pipe(
        Effect.flatMap(S.encodeEffect(ProofFromBase64JsonString)),
        Effect.mapError((cause) => new ResolverError({ cause })),
      )

      return { headers: { [SIGN_IN_WITH_X]: header } }
    },
    Effect.catchTags({
      SchemaError: (cause) => new ResolverError({ cause }),
    }),
  )
