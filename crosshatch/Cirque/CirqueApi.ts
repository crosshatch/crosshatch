import { BigDecimal, Schema as S } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

import { AccountId } from "../AccountId.ts"
import { FacilitatorApiGroup } from "../FacilitatorApi/index.ts"
import { Amount } from "../index.ts"

export const Providers = ["ApplePay", "Stripe", "Coinbase"] as const
export type Provider = typeof Provider.Type
export const Provider = S.Literals(Providers)

export type OnrampPayload = typeof OnrampPayload.Type
export const OnrampPayload = S.Struct({
  provider: Provider,
  amount: Amount.Amount.check(S.isGreaterThanBigDecimal(BigDecimal.fromBigInt(0n))),
  recipient: AccountId,
})

export class CirqueApi extends HttpApi.make("cirque")
  .add(
    HttpApiGroup.make("ramp")
      .add(
        HttpApiEndpoint.post("onramp", "/onramp", {
          payload: OnrampPayload,
          success: S.Struct({ url: S.String }),
        }),
      )
      .prefix("/ramp"),
  )
  .add(FacilitatorApiGroup.prefix("/facilitator")) {}
