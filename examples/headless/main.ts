import { Mnemonic } from "crosshatch"
import * as Headless from "crosshatch/Headless"
import * as KnownAsset from "crosshatch/KnownAsset"
import { Config, Effect } from "effect"
import { HttpClient } from "effect/unstable/http"

Effect.gen(function* () {
  const client = yield* HttpClient.HttpClient
  const url = yield* Config.string("URL").pipe(Config.withDefault("https://lmnl.im"))
  const response = yield* client.get(url)
  yield* Effect.log(response.status, yield* response.text)
}).pipe(Effect.provide(Headless.layerConfig(Mnemonic.config("SEED_PHRASE"), KnownAsset)), Effect.runPromise)
