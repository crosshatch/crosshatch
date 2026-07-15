import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Effect, Layer } from "effect"
import { PrPreviewComment } from "liminal-util/alchemicals/PrComment"

import FacilitatorWorker from "./main.ts"

export default Alchemy.Stack(
  "crosshatch-facilitator",
  {
    state: Cloudflare.state(),
    providers: Layer.mergeAll(Cloudflare.providers(), Github.providers()),
  },
  Effect.gen(function* () {
    const worker = yield* FacilitatorWorker
    const url = worker.url.as<string>()
    yield* PrPreviewComment({ name: "Facilitator", url })
    return { url }
  }),
)
