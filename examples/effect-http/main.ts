import { USDC } from "@crosshatch/assets"
import { CaipConfig } from "@crosshatch/caip"
import { Http402 } from "@crosshatch/merchant"
import { Required } from "@crosshatch/x402"
import { Asset, settle } from "crosshatch"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: HttpRouter.add(
    "GET",
    "/paid",
    Effect.gen(function* () {
      const payload = yield* Http402.Payload
      if (!payload) {
        const required = Required.builder({
          url: "https://example-merchant.com",
        }).pipe(
          Required.accepts(
            Asset.requirements(USDC, {
              amount: 0.01,
              recipients: {
                eip155: {
                  8453: yield* CaipConfig.accountAddress("PAY_TO_EVM"),
                },
              },
            }),
          ),
        )`
        | Description of the charge here.
        | What is this charge for?
        | How does it fit into the current flow?
        `
        return yield* Http402.require(required)
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
        exposedHeaders: Http402.EXPOSED_HEADERS,
      }),
      Http402.layer,
    ]),
    HttpRouter.toHttpEffect,
    Effect.flatten,
  ),
  prelude: Layer.empty,
})
