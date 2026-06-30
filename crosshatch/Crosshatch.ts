import { Schema as S, Context, Effect, Layer } from "effect"
import { HttpApi, HttpApiEndpoint, HttpApiGroup, HttpApiClient } from "effect/unstable/httpapi"

import { CaAccountId } from "./internal/CaAccountId.ts"
import { Stage } from "./Stage.ts"

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

export class CrosshatchClient extends Context.Service<CrosshatchClient>()("crosshatch/CrosshatchClient", {
  make: Effect.gen(function* () {
    const { domain } = yield* Stage
    return yield* HttpApiClient.make(CrosshatchApi, {
      baseUrl: domain(),
    })
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
