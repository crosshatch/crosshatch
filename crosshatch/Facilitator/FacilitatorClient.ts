import { Context, Effect, Layer } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { HttpApiClient } from "effect/unstable/httpapi"

import { FacilitatorApiGroup, FacilitatorApi } from "./FacilitatorApi.ts"

export class FacilitatorClient extends Context.Reference<
  HttpApiClient.Client<typeof FacilitatorApiGroup>["facilitator"]
>("crosshatch/FacilitatorClient", {
  defaultValue: () =>
    HttpApiClient.make(FacilitatorApi, {
      baseUrl: "https://facilitator.crosshatch.dev",
    }).pipe(Effect.provide(FetchHttpClient.layer), Effect.runSync)["facilitator"],
}) {
  static readonly layer = ({ baseUrl }: { readonly baseUrl: string }) =>
    Layer.effect(
      this,
      HttpApiClient.make(FacilitatorApi, { baseUrl }).pipe(Effect.map(({ facilitator }) => facilitator)),
    )
}
