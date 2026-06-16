import { AccountAddress } from "@crosshatch/caip"
import { Http402, Merchant } from "@crosshatch/merchant"
import { settle } from "crosshatch"
import { Layer, Effect } from "effect"
import { Worker } from "effect-workerd"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default Worker.make({
  handler: Layer.mergeAll(
    HttpRouter.add("GET", "/health", Effect.succeed(HttpServerResponse.text("ok"))),
    HttpRouter.add(
      "GET",
      "/paid",
      Effect.gen(function* () {
        const payload = yield* Http402.Payload
        if (!payload) {
          return yield* Http402.require("0.01 eip155:8453 USDC")`
          | Description of the charge here.
          `
        }
        yield* settle({ payload })
        return HttpServerResponse.text("The paid resource.")
      }),
    ),
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
  prelude: Layer.mergeAll(
    Merchant.layer({
      pot: AccountAddress.make("..."),
      url: "https://example-x402-endpoint.com",
    }),
  ),
})
