import { ChxDomain } from "@crosshatch/util"
import { Context, Effect, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { CirqueApi } from "./CirqueApi.ts"

export class CirqueClient extends Context.Service<CirqueClient, HttpApiClient.ForApi<typeof CirqueApi>>()(
  "crosshatch/Cirque/CirqueClient",
) {}

export const layer = Layer.effect(
  CirqueClient,
  Effect.gen(function* () {
    const { url: baseUrl } = yield* ChxDomain.ChxDomain
    return yield* HttpApiClient.make(CirqueApi, { baseUrl })
  }).pipe(Effect.provide(ChxDomain.layer("cirque.sh"))),
)
