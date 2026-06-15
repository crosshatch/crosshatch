import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Effect, Config, Layer } from "effect"
import { PrPreviewComment } from "liminal-util/alchemicals/PrComment"
import { WorkerConfig } from "liminal-util/alchemicals/WorkerConfig"

export default Alchemy.Stack(
  "crosshatch-facilitator",
  {
    state: Cloudflare.state(),
    providers: Layer.mergeAll(Cloudflare.providers(), Github.providers()),
  },
  Effect.gen(function* () {
    const base = yield* WorkerConfig({
      domain: "facilitator.crosshatch.dev",
    })
    const STAGE = yield* Alchemy.Stage
    const { url } = yield* Cloudflare.Worker("Entry", {
      ...base,
      main: "main.ts",
      env: {
        STAGE,
        VITE_PUBLIC_STAGE: STAGE,
        CDP_API_KEY_ID: Config.string("CDP_API_KEY_ID"),
        CDP_API_KEY_SECRET: Config.redacted("CDP_API_KEY_SECRET"),
      },
    })
    yield* PrPreviewComment({ name: "Facilitator", url })
    return { url }
  }),
)
