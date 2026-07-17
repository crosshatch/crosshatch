import * as Cloudflare from "alchemy/Cloudflare"
import { Required, Requirements, ChxHttp, KnownAssets, Payload, Facilitator } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { PaymentId } from "crosshatch/Extensions"
import { Layer, Effect, Config } from "effect"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

export default class ExampleEffectHttp extends Cloudflare.Worker<ExampleEffectHttp>()(
  "ExampleEffectHttp",
  {
    main: import.meta.url,
    domain: "example-effect-http.crosshatch.dev",
    observability: { enabled: true },
    placement: { mode: "smart" },
    compatibility: {
      date: "2026-02-05",
      flags: ["nodejs_compat", "global_fetch_strictly_public"],
    },
    dev: {
      host: "127.0.0.1",
      port: 4385,
      strictPort: true,
    },
  },
  Effect.gen(function* () {
    const recipient = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
    const handler = HttpRouter.add(
      "GET",
      "/paid",
      Effect.gen(function* () {
        const payload = yield* Payload.Payload
        if (!payload) {
          const required = yield* Required.make`
          |
          | Description of the charge here.
          |
          | What is this charge for?
          |
          | How does it fit into the current flow?
          |
          `.pipe(
            Required.extend(PaymentId.FromMerchant, {
              required: true,
              id: PaymentId.random(),
            }),
            Required.accept(
              Requirements.denomination(KnownAssets.Usd, {
                amount: 0.01,
                recipients: { eip155: { 8453: recipient } },
              }),
            ),
          )
          return yield* ChxHttp.require({ required })
        }
        const settlement = yield* Facilitator.settle({ payload })
        return HttpServerResponse.text("The paid resource.").pipe(ChxHttp.addResponseHeader(settlement))
      }),
    ).pipe(
      Layer.provide([
        Facilitator.layer(),
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
          exposedHeaders: ChxHttp.HEADERS,
        }),
        ChxHttp.layerMiddleware({
          extensions: [PaymentId.FromMerchant],
        }),
      ]),
      HttpRouter.toHttpEffect,
      Effect.scoped,
      Effect.flatten,
    )
    return { fetch: handler }
  }),
) {}
