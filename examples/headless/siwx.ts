import { ChxHttp, Mnemonic } from "crosshatch"
import * as Siwx from "crosshatch/Siwx"
import { Config, Console, Effect, Layer } from "effect"
import { FetchHttpClient, HttpClient } from "effect/unstable/http"

import { PayerLive } from "./PayerLive.ts"

const SiwxHttpClientLive = ChxHttp.layerClient(
  Siwx.Client.resolver(Siwx.Siwe.prover, Siwx.Siws.prover),
  ChxHttp.Payment.resolver,
).pipe(Layer.provide([FetchHttpClient.layer, PayerLive, Siwx.layerProvers.pipe(Layer.provide(Mnemonic.layerEnv))]))

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
