import { Array, Effect, Layer, Option, pipe, Schema as S } from "effect"

import * as Extension from "../Extension.ts"
import { Siwx } from "./Extension.ts"
import type { Prover } from "./Prover.ts"

export const layer = <const Provers extends ReadonlyArray<Prover.Any>>(
  ...provers: Provers
): Layer.Layer<never, never, Prover.Context<Provers[number]>> =>
  Extension.layerHandler(
    Siwx,
    Effect.fnUntraced(function* ({ info: challenge, request, accepted }) {
      if (!request) {
        return
      }

      const requestUrl = S.decodeOption(S.URLFromString)(request.url)
      if (requestUrl._tag === "None") {
        return
      }

      const challengeUri = URL.parse(challenge.info.uri)
      if (challenge.info.domain !== requestUrl.value.host || challengeUri?.href !== requestUrl.value.href) {
        return
      }

      const candidates = Array.flatMap(challenge.supportedChains, (entry) =>
        pipe(
          Array.findFirst(
            provers,
            ({ type, scheme, supportsChainId }) =>
              type === entry.type &&
              (!entry.signatureScheme || entry.signatureScheme === scheme) &&
              supportsChainId(entry.chainId),
          ),
          Option.map((prover) => ({ entry, prover })),
          Array.fromOption,
        ),
      )

      const selected = Option.orElse(
        Array.findFirst(candidates, ({ entry }) => entry.chainId === accepted.network),
        () => Array.head(candidates),
      )

      if (selected._tag === "None") {
        return
      }

      const { entry, prover } = selected.value
      const signed = yield* prover.sign(challenge.info, entry.chainId).pipe(Effect.option)
      if (signed._tag === "None") {
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
