import { Array as A, Data, Effect, Option, Schema as S } from "effect"

import { Accept } from "../Accept.ts"
import type { Resolver } from "../ChxHttp/Resolver.ts"
import type { Prover } from "./Prover.ts"
import { ChallengeFromJson, ProofFromBase64JsonString, SIGN_IN_WITH_X } from "./Schema.ts"

export class ClientError extends Data.TaggedError("ClientError")<{ readonly cause?: unknown }> {}

export const resolver = <const Provers extends ReadonlyArray<Prover.Any>>(
  ...provers: Provers
): Resolver<ClientError, Prover.Context<Provers[number]>> =>
  Effect.fnUntraced(function* ({ request, required }) {
    const challengeJson = required.extensions?.[SIGN_IN_WITH_X]
    if (challengeJson === undefined) {
      return
    }

    const requestUrl = yield* S.decodeUnknownEffect(S.URLFromString)(request.url)

    const challenge = yield* S.decodeUnknownEffect(ChallengeFromJson)(challengeJson)
    const challengeUri = URL.parse(challenge.info.uri)
    if (challenge.info.domain !== requestUrl.host || challengeUri?.href !== requestUrl.href) {
      return yield* new ClientError({})
    }

    const answers = A.flatMap(challenge.supportedChains, (entry) =>
      A.findFirst(provers, (prover) => prover(challenge.info, entry)).pipe(
        Option.map((sign) => ({ entry, sign })),
        A.fromOption,
      ),
    )

    const paymentChain = yield* Effect.serviceOption(Accept).pipe(
      Effect.map(Option.map((accept) => Effect.option(Effect.map(accept({ required }), ({ chainId }) => chainId)))),
      Effect.flatMap(Option.getOrElse(() => Effect.succeedNone)),
    )

    const answer = Option.orElse(
      Option.flatMap(paymentChain, (chainId) => A.findFirst(answers, ({ entry }) => entry.chainId === chainId)),
      () => A.head(answers),
    )

    if (Option.isNone(answer)) {
      return
    }

    const header = yield* answer.value.sign.pipe(Effect.flatMap(S.encodeEffect(ProofFromBase64JsonString)))
    return { headers: { [SIGN_IN_WITH_X]: header } }
  })
