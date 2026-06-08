import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Drizzle from "alchemy/Drizzle"
import * as Planetscale from "alchemy/Planetscale"
import { Effect, Config, Layer } from "effect"
import * as AlchemicalEnv from "liminal-util/alchemicals/AlchemicalEnv"
import { WorkerConfig } from "liminal-util/alchemicals/WorkerConfig"

export default Alchemy.Stack(
  "crosshatch-facilitator",
  {
    state: Cloudflare.state(),
    providers: Layer.mergeAll(Cloudflare.providers(), Planetscale.providers(), Drizzle.providers()),
  },
  Effect.gen(function* () {
    const base = yield* WorkerConfig({
      domain: "facilitator.crosshatch.dev",
    })
    return yield* Cloudflare.Worker("Entry", {
      ...base,
      main: "main.ts",
      env: {
        CDP_API_KEY_ID: yield* Config.string("CDP_API_KEY_ID"),
        CDP_API_KEY_SECRET: yield* Config.redacted("CDP_API_KEY_SECRET"),
      },
    })
  }).pipe(Effect.provide(AlchemicalEnv.layer)),
)
