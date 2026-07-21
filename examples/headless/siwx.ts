import { ChxHttp } from "crosshatch"
import { Config, Console, Effect } from "effect"
import { HttpClient } from "effect/unstable/http"

import { SiwxHttpClientLive } from "./SiwxHttpClientLive.ts"

Effect.gen(function* () {
  const url = yield* Config.string("SIWX_URL").pipe(
    Config.withDefault("https://example-effect-http.crosshatch.dev.localhost/paid"),
  )
  const response = yield* HttpClient.get(url)
  yield* Console.log({
    status: response.status,
    paid: response.headers[ChxHttp.PAYMENT_RESPONSE] !== undefined,
  })
}).pipe(Effect.provide(SiwxHttpClientLive), Effect.runFork)
