import * as Cloudflare from "alchemy/Cloudflare"
import { ChxRpc, Facilitator, KnownAssets, Payer, Payload, Required, Requirements } from "crosshatch"
import { Eip155Address } from "crosshatch/Eip155"
import { PaymentId } from "crosshatch/Extensions"
import { Config, Effect, Layer, Schema as S } from "effect"
import { Rpc, RpcGroup, RpcSerialization, RpcServer } from "effect/unstable/rpc"

class Api extends ChxRpc.ChxRpcGroup.merge(
  RpcGroup.make(
    Rpc.make("Foo", {
      success: S.String,
    }),
  ),
) {}

export default class ExampleEffectRpc extends Cloudflare.RpcWorker<ExampleEffectRpc>()(
  "ExampleEffectRpc",
  {
    main: import.meta.url,
    schema: Api,
    domain: "example-effect-rpc.crosshatch.dev",
    observability: { enabled: true },
    placement: { mode: "smart" },
    compatibility: {
      date: "2026-02-05",
      flags: ["nodejs_compat", "global_fetch_strictly_public"],
    },
    dev: {
      host: "127.0.0.1",
      port: 4386,
      strictPort: true,
    },
  },
  Effect.gen(function* () {
    const recipient = yield* Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155")
    return RpcServer.toHttpEffect(Api).pipe(
      Effect.scoped,
      Effect.provide([
        Api.toLayerHandler(
          "Foo",
          Effect.fn(function* () {
            for (let i = 0; i < 5; i++) {
              const required = yield* Required.make`iteration ${i}`.pipe(
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
              const { payload } = yield* Payload.make({ required })
              yield* Facilitator.settle({ payload })
            }
            return "bar"
          }, Effect.orDie),
        ).pipe(Layer.provideMerge(Payer.layerBridge.pipe(Layer.provideMerge(ChxRpc.layer)))),
        RpcSerialization.layerJson,
      ]),
    )
  }),
) {}
