import { Context, Layer } from "effect"
import { HttpApiGroup, HttpApi, HttpApiClient } from "effect/unstable/httpapi"

import { Settle } from "./Settle.ts"
import { Supported } from "./Supported.ts"
import { Verify } from "./Verify.ts"

export * from "./Settle.ts"
export * from "./Supported.ts"
export * from "./Verify.ts"

export const Facilitator = HttpApiGroup.make("facilitator").add(Verify).add(Settle).add(Supported)

export class FacilitatorClient extends Context.Service<FacilitatorClient, HttpApiClient.Client<typeof Facilitator>>()(
  "@crosshatch/x402/FacilitatorClient",
) {
  static readonly layer = ({ baseUrl }: { readonly baseUrl?: string | undefined }) =>
    Layer.effect(this, HttpApiClient.make(HttpApi.make("facilitator").add(Facilitator), { baseUrl }))
}
