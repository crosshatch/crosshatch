import * as Cloudflare from "alchemy/Cloudflare"
import { Payload, Required, Facilitator, ResourceInfo, Address, Accepts, RequiredResponse } from "crosshatch"
import { USDC, USDCE, USDT } from "crosshatch/coins"
import { Eip155 } from "crosshatch/namespaces/Eip155"
import { USD } from "crosshatch/units"
import { Layer, Effect } from "effect"
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
    const fetch = HttpRouter.add(
      "GET",
      "/paid",
      Effect.gen(function* () {
        const eip155 = yield* Address.fromConfig(Eip155.Eip155, "PAY_TO_EIP155")
        const accepts = Accepts.empty.pipe(
          Accepts.addInstrument(USDC, "0.01"),
          Accepts.addUnit(USD, [USDT, USDCE, USDT], "0.01"),
          Accepts.address({ eip155 }),
        )
        const payload = yield* Payload.Payload
        if (Payload.match(payload, accepts)) {
          const settlement = yield* Facilitator.settle(payload)
          return HttpServerResponse.text("The paid resource.").pipe(Facilitator.withHeaders(settlement))
        }
        const required = yield* Required.describe`
        |
        | Description of the charge here.
        |
        `(accepts)
        return yield* RequiredResponse.make(required)
      }).pipe(Effect.provide(Payload.layerFromRequest)),
    ).pipe(
      Layer.provide([
        HttpRouter.cors({
          allowedHeaders: ["*"],
          allowedMethods: ["*"],
          allowedOrigins: ["*"],
          exposedHeaders: ["TODO"],
        }),
      ]),
      HttpRouter.toHttpEffect,
      Effect.flatten,
      Effect.provide([Facilitator.layer(""), ResourceInfo.layer({ url: "https://popeyes.dev" })]),
      Effect.orDie,
    )
    return { fetch }
  }),
) {}
