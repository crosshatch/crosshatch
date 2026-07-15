import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import { Effect } from "effect"

import ExampleEffectHttp from "./ExampleEffectHttp.ts"

export default Alchemy.Stack(
  "crosshatch-example-effect-http",
  {
    state: Cloudflare.state(),
    providers: Cloudflare.providers(),
  },
  Effect.gen(function* () {
    const worker = yield* ExampleEffectHttp
    return { url: worker.url.as<string>() }
  }),
)
