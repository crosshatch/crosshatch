import { Effect, Context, Layer } from "effect"
import { HttpApiClient } from "effect/unstable/httpapi"

import { Facilitator, FacilitatorApi } from "./Facilitator.ts"

export class FacilitatorClient extends Context.Service<FacilitatorClient, HttpApiClient.Client<typeof Facilitator>>()(
  "crosshatch/X402/FacilitatorClient",
) {}

let default_: HttpApiClient.Client<typeof Facilitator> | undefined
export const getOrDefault = Effect.gen(function* () {
  const provided = yield* Effect.serviceOption(FacilitatorClient)
  if (provided._tag === "Some") {
    const { facilitator } = provided.value
    return facilitator
  }
  if (!default_) {
    default_ = yield* HttpApiClient.make(FacilitatorApi, {
      baseUrl: "https://facilitator.crosshatch.dev",
    })
  }
  return default_.facilitator
})

export const layer = ({ baseUrl }: { readonly baseUrl: string }) =>
  HttpApiClient.make(FacilitatorApi, { baseUrl }).pipe(Layer.effect(FacilitatorClient))
