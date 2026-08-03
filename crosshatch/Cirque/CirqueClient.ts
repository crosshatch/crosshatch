import * as ChxStage from "@crosshatch/util/ChxStage"
import { Context, Effect, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { CirqueApi } from "./CirqueApi.ts"

export class CirqueClient extends Context.Service<CirqueClient, HttpApiClient.ForApi<typeof CirqueApi>>()(
  "crosshatch/cirque/CirqueClient",
) {}

export const layer = Layer.effect(
  CirqueClient,
  Effect.gen(function* () {
    const stage = yield* ChxStage.ChxStage
    return yield* HttpApiClient.make(CirqueApi, {
      baseUrl: `https://cirque.sh${stage.startsWith("dev_") ? ".localhost" : ""}`,
    })
  }),
)
