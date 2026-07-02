import { Mnemonic } from "crosshatch"
import * as Headless from "crosshatch/Headless"
import * as KnownAsset from "crosshatch/KnownAsset"
import { Config, Effect } from "effect"

Effect.gen(function* () {
  const runtime = yield* Headless.fromMnemonicConfig(Mnemonic.config("SEED_PHRASE"), KnownAsset)
  const fetch = Headless.makeFetch(runtime)
  const url = yield* Config.string("URL").pipe(Config.withDefault("https://lmnl.im"))
  const response = yield* Effect.promise(() => fetch(url))
  const text = yield* Effect.promise(() => response.text())
  yield* Effect.log(response.status, text)
  yield* runtime.disposeEffect
}).pipe(Effect.runPromise)
