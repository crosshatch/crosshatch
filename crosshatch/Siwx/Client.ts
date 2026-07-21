import { Array as A, Effect, Layer, Option, pipe, Schema as S } from "effect"

import * as Extension from "../Extension.ts"
import { Siwx } from "./Extension.ts"
import type { Prover } from "./Prover.ts"

export const layer = <const Provers extends ReadonlyArray<Prover.Any>>(
  ...provers: Provers
): Layer.Layer<never, never, Prover.Context<Provers[number]>> =>
  Extension.layerHandler(
    Siwx,
    Effect.fnUntraced(function* ({ info: challenge, request, accepted }) {
      if (request === undefined) {
        return
      }

      const requestUrl = yield* S.decodeUnknownEffect(S.URLFromString)(request.url).pipe(Effect.option)
      if (Option.isNone(requestUrl)) {
        return
      }

      const challengeUri = URL.parse(challenge.info.uri)
      if (challenge.info.domain !== requestUrl.value.host || challengeUri?.href !== requestUrl.value.href) {
        return
      }

      const candidates = A.flatMap(challenge.supportedChains, (entry) =>
        pipe(
          A.findFirst(
            provers,
            ({ type, scheme, supportsChainId }) =>
              type === entry.type &&
              (entry.signatureScheme === undefined || entry.signatureScheme === scheme) &&
              supportsChainId(entry.chainId),
          ),
          Option.map((prover) => ({ entry, prover })),
          A.fromOption,
        ),
      )

      const selected = Option.orElse(
        A.findFirst(candidates, ({ entry }) => entry.chainId === accepted.network),
        () => A.head(candidates),
      )

      if (Option.isNone(selected)) {
        return
      }

      const { entry, prover } = selected.value
      const signed = yield* prover.sign(challenge.info, entry.chainId).pipe(Effect.option)
      if (Option.isNone(signed)) {
        return
      }

      return {
        ...challenge.info,
        address: signed.value.address,
        chainId: entry.chainId,
        type: prover.type,
        signatureScheme: prover.scheme,
        signature: signed.value.signature,
      }
    }),
  )
