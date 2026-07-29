import { Schema as S } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

import { CaAccountId } from "./CaAccountId.ts"

export const Providers = ["ApplePay", "Stripe", "Coinbase"] as const
export const Provider = S.Literals(Providers)
export type Provider = typeof Provider.Type

export class RampApiGroup extends HttpApiGroup.make("ramp")
  .add(
    HttpApiEndpoint.post("onramp", "/onramp", {
      payload: S.Struct({
        provider: Provider,
        amount: S.Int.check(S.isGreaterThan(0)),
        recipient: CaAccountId,
      }),
      success: S.Struct({
        onrampUrl: S.String,
      }),
      error: S.Never,
    }),
  )
  .prefix("/ramp") {}

export class RampApi extends HttpApi.make("ramp").add(RampApiGroup) {}
