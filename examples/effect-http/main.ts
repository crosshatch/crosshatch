import { Facilitator, Required, Requirements, Http402, KnownAssets, Payload } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { PaymentId } from "crosshatch/Extensions"
import { Layer, Effect, Config } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: HttpRouter.add(
    "GET",
    "/paid",
    Effect.gen(function* () {
      const payload = yield* Payload.Payload
      if (!payload) {
        const PAY_TO_EIP155 = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
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
              recipients: { eip155: { 8453: PAY_TO_EIP155 } },
            }),
          ),
        )
        return yield* Http402.require({ required })
      }
      const settlement = yield* Facilitator.settle({ payload })
      return HttpServerResponse.text("The paid resource.").pipe(Http402.addResponseHeader(settlement))
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
