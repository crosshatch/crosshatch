import { Facilitator, Required, Requirements, Http402, KnownAssets } from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { PaymentId } from "crosshatch/Extensions"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: HttpRouter.add(
    "GET",
    "/paid",
    Effect.gen(function* () {
      const payload = yield* Http402.ResolvedPayload
      if (!payload) {
        const PAY_TO_EVM = yield* EvmAddress.config("PAY_TO_EVM")
        const required = yield* Required.make`
        |
        | Description of the charge here.
        |
        | What is this charge for?
        |
        | How does it fit into the current flow?
        |
        `.pipe(
          Required.extend(PaymentId.PaymentIdExtension, {
            required: true,
          }),
          Required.accept(
            Requirements.asset(KnownAssets.USDC, {
              amount: 0.01,
              recipients: { eip155: { 8453: PAY_TO_EVM } },
            }),
          ),
        )
        return yield* Http402.require({ required })
      }
      const settlement = yield* Facilitator.settle({ payload })
      return yield* HttpServerResponse.text("The paid resource.").pipe(Http402.addResponseHeader(settlement))
    }),
  ).pipe(
    Layer.provide([
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: ["*"],
        exposedHeaders: Http402.EXPOSED_HEADERS,
      }),
      Http402.layerMiddleware({
        extensions: [PaymentId.PaymentIdExtension],
      }),
    ]),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.empty,
})
