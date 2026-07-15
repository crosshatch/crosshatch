import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import { Effect } from "effect"

import ExampleEffectRpc from "./ExampleEffectRpc.ts"

export default Alchemy.Stack(
  "crosshatch-example-effect-rpc",
  {
    state: Cloudflare.state(),
    providers: Cloudflare.providers(),
  },
  Effect.gen(function* () {
    const worker = yield* ExampleEffectRpc
    return { url: worker.url.as<string>() }
  }),
)
