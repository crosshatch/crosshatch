import { Schema as S } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

import { CaAccountId } from "./CaAccountId.ts"

export class RampApiGroup extends HttpApiGroup.make("ramp")
  .add(
    HttpApiEndpoint.post("onramp", "/onramp", {
      payload: S.Struct({
        provider: S.Literals(["ApplePay", "Stripe", "Coinbase"]),
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

export class RampApi extends HttpApi.make("crosshatch_ramp").add(RampApiGroup) {}
