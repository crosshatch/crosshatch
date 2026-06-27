import { settle, Required, Requirements, PaymentId } from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { Http402Middleware, Http402Payload, EXPOSED_HEADERS } from "crosshatch/Http402"
import { USDC } from "crosshatch/KnownAsset"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: HttpRouter.add(
    "GET",
    "/paid",
    Effect.gen(function* () {
      const payload = yield* Http402Payload.Http402Payload
      if (!payload) {
        const required = yield* Required.empty({
          url: "https://example-merchant.com",
        }).pipe(
          Required.extend(PaymentId.PaymentIdExtension, {
            required: true,
          }),
          Required.accept(
            Requirements.group(USDC, {
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
        return yield* Http402Payload.require(required)
      }
      yield* settle({ payload })
      return HttpServerResponse.text("The paid resource.")
    }),
  ).pipe(
    Layer.provide([
      HttpRouter.cors({
        allowedHeaders: ["*"],
        allowedMethods: ["*"],
        allowedOrigins: ["*"],
        exposedHeaders: EXPOSED_HEADERS,
      }),
      Http402Middleware.layer,
    ]),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.empty,
})
