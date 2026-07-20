import * as Cloudflare from "alchemy/Cloudflare"
import { ChxHttp, Facilitator, KnownAssets, Payload, Required, Requirements } from "crosshatch"
import * as CaAccountId from "crosshatch/CaAccountId"
import { Eip155Address } from "crosshatch/Eip155"
import { PaymentId } from "crosshatch/Extensions"
import * as Siwx from "crosshatch/Siwx"
import { Config, Effect, Layer, Schema as S } from "effect"
import { HttpRouter, HttpServerResponse } from "effect/unstable/http"

const verifiers = [Siwx.Siwe.verifier] as const
const paidResource = Siwx.Entitlement.Id.make("paid-resource")

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
    const publicOrigin = yield* Config.schema(S.URLFromString, "PUBLIC_ORIGIN")

    const siwxServer = Siwx.Server.layerMiddleware({ verifiers, origin: publicOrigin.origin }).pipe(
      Layer.provide(Siwx.ChallengeStore.layerChallengeMemory),
    )

    const handler = HttpRouter.add(
      "GET",
      "/paid",
      Effect.fn(function* () {
        const identity = yield* Siwx.Identity.Identity
        if (yield* Siwx.Entitlements.isEntitled(paidResource)) {
          return HttpServerResponse.text("Premium content unlocked.")
        }
        const payload = yield* Payload.Payload
        if (identity === undefined || payload === undefined) {
          const required = yield* Required.make`Access the paid resource.`.pipe(
            Required.extend(PaymentId.FromMerchant, {
              required: true,
              id: PaymentId.random(),
            }),
            Required.accept(
              Requirements.denomination(KnownAssets.Usd, {
                amount: 0.01,
                recipients: { eip155: { 8453: recipient } },
                ttl: "1 minutes",
              }),
            ),
            Siwx.Challenge.extend({ verifiers, statement: "Sign in to access your purchase" }),
          )
          return yield* ChxHttp.require({ required })
        }
        const settlement = yield* Siwx.Entitlements.purchase({
          id: paidResource,
          payload,
        })
        if (settlement === undefined) {
          return HttpServerResponse.empty({ status: 403 })
        }
        return HttpServerResponse.text("Premium content unlocked.").pipe(ChxHttp.addResponseHeader(settlement))
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
        ChxHttp.layerMiddleware({ extensions: [PaymentId.FromMerchant] }),
        siwxServer,
        Siwx.Entitlements.layerProvideMemory,
        Layer.succeed(Siwx.Entitlements.Builders, [CaAccountId.eip155.builder]),
      ]),
      HttpRouter.toHttpEffect,
      Effect.scoped,
      Effect.flatten,
    )
    return { fetch: handler }
  }),
) {}
