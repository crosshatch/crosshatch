import { Schema as S } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup } from "effect/unstable/httpapi"

import { CaAccountId } from "./CaAccountId.ts"

export class CrosshatchApi extends HttpApi.make("crosshatch").add(
  HttpApiGroup.make("onramp").add(
    HttpApiEndpoint.post("session", "/session", {
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
  ),
) {}
