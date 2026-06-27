import { Context, Effect, Layer } from "effect"
import { HttpApi, HttpApiGroup, HttpApiClient } from "effect/unstable/httpapi"

import { Settle } from "./Settle.ts"
import { Supported } from "./Supported.ts"
import { Verify } from "./Verify.ts"

export { Supported, Settle, Verify }

export class FacilitatorApiGroup extends HttpApiGroup.make("facilitator").add(Verify).add(Settle).add(Supported) {}

export class FacilitatorApi extends HttpApi.make("facilitator").add(FacilitatorApiGroup) {}

export class FacilitatorClient extends Context.Service<
  FacilitatorClient,
  HttpApiClient.Client<typeof FacilitatorApiGroup>
>()("crosshatch/FacilitatorClient") {
  static #default_: HttpApiClient.Client<typeof FacilitatorApiGroup>

  static readonly getOrDefault = Effect.gen({ self: this }, function* () {
    const provided = yield* Effect.serviceOption(FacilitatorClient)
    if (provided._tag === "Some") {
      return provided.value.facilitator
    }
    if (!this.#default_) {
      this.#default_ = yield* HttpApiClient.make(FacilitatorApi, {
        baseUrl: "https://facilitator.crosshatch.dev",
      })
    }
    return this.#default_.facilitator
  })

  static readonly layer = ({ baseUrl }: { readonly baseUrl: string }) =>
    HttpApiClient.make(FacilitatorApi, { baseUrl }).pipe(Layer.effect(this))
}
