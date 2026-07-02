import { Facilitator, Required, Requirements, PaymentId, Http402, KnownAsset } from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: HttpRouter.add(
    "GET",
    "/paid",
    Effect.gen(function* () {
      const payload = yield* Http402.Http402Payload
      if (!payload) {
        const required = yield* Required.builder({
          url: "https://example-merchant.com",
        }).pipe(
          Required.extend(PaymentId.PaymentIdExtension, {
            required: true,
          }),
          Required.accept(
            Requirements.group(KnownAsset.USDC, {
              amount: 0.01,
              recipients: {
                eip155: {
                  8453: yield* EvmAddress.config("PAY_TO_EVM"),
                },
              },
            }),
          ),
        )`
        | Description of the charge here.
        | What is this charge for?
        | How does it fit into the current flow?
        `
        return yield* Http402.require({ required })
      }
      yield* Facilitator.settle({ payload })
      return HttpServerResponse.text("The paid resource.")
    }),
  ).pipe(
    Layer.provide([
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: ["*"],
        exposedHeaders: Http402.EXPOSED_HEADERS,
      }),
      Http402.layer,
    ]),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.empty,
})
