import { ChxHttp, Mnemonic } from "crosshatch"
import { Eip155Signer } from "crosshatch/Eip155/Eip155"
import * as Siwx from "crosshatch/Siwx"
import { SolanaSigner } from "crosshatch/Solana/Solana"
import { Config, Console, Effect, Layer } from "effect"
import { HttpClient } from "effect/unstable/http"

import { PayerLive } from "./PayerLive.ts"

const SiwxHttpClientLive = Layer.mergeAll(
  ChxHttp.layerClient.pipe(Layer.provide(PayerLive)),
  Siwx.Client.layer(Siwx.Siwe.prover, Siwx.Siws.prover).pipe(
    Layer.provide(
      Layer.mergeAll(Eip155Signer.layerMnemonic, SolanaSigner.layerMnemonic).pipe(Layer.provide(Mnemonic.layerEnv)),
    ),
  ),
)

Effect.gen(function* () {
  const url = yield* Config.string("SIWX_URL").pipe(
    Config.withDefault("https://example-effect-http.crosshatch.dev.localhost/paid"),
  )
  const first = yield* HttpClient.get(url)
  const second = yield* HttpClient.get(url)
  yield* Console.log({
    first: {
      status: first.status,
      paid: first.headers[ChxHttp.PAYMENT_RESPONSE] !== undefined,
    },
    second: {
      status: second.status,
      paid: second.headers[ChxHttp.PAYMENT_RESPONSE] !== undefined,
    },
  })
}).pipe(Effect.provide(SiwxHttpClientLive), Effect.runFork)
