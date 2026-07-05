import { Facilitator, Required, Requirements, PaymentId, Http, KnownAsset } from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: HttpRouter.add(
    "GET",
    "/paid",
    Effect.gen(function* () {
      const payload = yield* Http.ResolvedPayload
      if (!payload) {
        const PAY_TO_EVM = yield* EvmAddress.config("PAY_TO_EVM")
        const required = yield* Required.builder({
          url: "https://example-merchant.com",
        }).pipe(
          Required.extend(PaymentId.PaymentIdExtension, {
            required: true,
          }),
          Required.accept(
            Requirements.group(KnownAsset.USDC, {
              amount: 0.01,
              recipients: { eip155: { 8453: PAY_TO_EVM } },
            }),
          ),
        )`
        | Description of the charge here.
        | What is this charge for?
        | How does it fit into the current flow?
        `
        return yield* Http.require({ required })
      }
      const settlement = yield* Facilitator.settle({ payload })
      return yield* HttpServerResponse.text("The paid resource.").pipe(Http.addSettlement(settlement))
    }),
  ).pipe(
    Layer.provide([
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: ["*"],
        exposedHeaders: Http.EXPOSED_HEADERS,
      }),
      Http.layerMiddleware,
    ]),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.empty,
})
