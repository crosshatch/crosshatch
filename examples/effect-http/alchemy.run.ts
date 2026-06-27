import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import { Effect } from "effect"
import { WorkerConfig } from "liminal-util/alchemicals/WorkerConfig"

export default Alchemy.Stack(
  "crosshatch-example-effect-http",
  {
    state: Cloudflare.state(),
    providers: Cloudflare.providers(),
  },
  Effect.gen(function* () {
    const base = yield* WorkerConfig({
      domain: "example-effect-http.crosshatch.dev",
    })
    const CROSSHATCH_STAGE = yield* Alchemy.Stage
    yield* Cloudflare.Website.Vite("Entry", {
      ...base,
      dev: {
        host: "127.0.0.1",
        port: 4384,
        strictPort: true,
      },
      env: {
        CROSSHATCH_STAGE,
        VITE_PUBLIC_CROSSHATCH_STAGE: CROSSHATCH_STAGE,
      },
    })
  }),
)
