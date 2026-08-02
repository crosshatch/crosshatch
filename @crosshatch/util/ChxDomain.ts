import { Context, Layer, Effect } from "effect"

import { ChxStage } from "./ChxStage.ts"

export class ChxDomain extends Context.Service<
  ChxDomain,
  {
    readonly name: string
    readonly url: string
  }
>()("@crosshatch/util/ChxDomain") {}

export const layer = (hostname: string) =>
  Layer.effect(
    ChxDomain,
    Effect.gen(function* () {
      const stage = yield* ChxStage
      const name = `${stage.startsWith("staging-") ? `${stage}.` : ""}${hostname}${stage.startsWith("dev_") ? ".localhost" : ""}`
      const url = `https://${name}`
      return { name, url }
    }),
  )
