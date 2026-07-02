import { BlockRun } from "@crosshatch/ai"
import { Mnemonic } from "crosshatch"
import * as Headless from "crosshatch/Headless"
import * as KnownAsset from "crosshatch/KnownAsset"
import { Effect } from "effect"
import { LanguageModel } from "effect/unstable/ai"

Effect.gen(function* () {
  const response = yield* LanguageModel.generateText({
    prompt: "Tell me a knock knock joke",
  })
  yield* Effect.log(response.text)
}).pipe(
  Effect.provide([BlockRun.layer, Headless.layerConfig(Mnemonic.config("SEED_PHRASE"), KnownAsset)]),
  Effect.runPromise,
)
