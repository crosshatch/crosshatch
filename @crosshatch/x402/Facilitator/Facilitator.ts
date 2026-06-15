import * as Stage from "@crosshatch/util/Stage"
import { Context, Layer, Effect } from "effect"
import { HttpApiClient, HttpApiGroup } from "effect/unstable/httpapi"
import { HttpApi } from "effect/unstable/httpapi"

import { Settle } from "./Settle.ts"
import { Supported } from "./Supported.ts"
import { Verify } from "./Verify.ts"

export class Facilitator extends HttpApiGroup.make("facilitator").add(Verify).add(Settle).add(Supported) {}

export class FacilitatorApi extends HttpApi.make("facilitator").add(Facilitator) {}

export class FacilitatorClient extends Context.Service<FacilitatorClient, HttpApiClient.Client<typeof Facilitator>>()(
  "@crosshatch/x402/FacilitatorClient",
) {
  static readonly layer = (config?: undefined | { readonly url?: string | undefined }) =>
    (config?.url
      ? Effect.succeed(config.url)
      : Stage.Stage.pipe(Effect.map(({ url }) => url({ sub: "facilitator" })))
    ).pipe(
      Effect.flatMap((baseUrl) => HttpApiClient.make(FacilitatorApi, { baseUrl })),
      Layer.effect(FacilitatorClient),
      Layer.provide(Stage.layerConfig),
    )
}
