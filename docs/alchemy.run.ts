import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Command from "alchemy/Command"
import * as GitHub from "alchemy/GitHub"
import { Effect, Layer } from "effect"
import { PrPreviewComment } from "liminal-util/alchemicals/PrComment"
import { WorkerConfig } from "liminal-util/alchemicals/WorkerConfig"

export default Alchemy.Stack(
  "crosshatch-docs",
  {
    state: Cloudflare.state(),
    providers: Layer.mergeAll(Cloudflare.providers(), GitHub.providers()),
  },
  Effect.gen(function* () {
    const base = yield* WorkerConfig({ domain: "crosshatch.dev" })
    const STAGE = yield* Alchemy.Stage
    const dev = yield* Command.Dev("Dev", {
      command: "pnpm exec vocs dev --host 127.0.0.1 --port 4382",
    })
    const { url } = yield* Cloudflare.Website.Vite("Docs", {
      ...base,
      dev: {
        mode: "external",
        url: dev.url,
      },
      assets: {
        htmlHandling: "drop-trailing-slash",
        notFoundHandling: "single-page-application",
        runWorkerFirst: ["/api/*", "/RSC/*"],
      },
      env: {
        STAGE,
        VITE_PUBLIC_STAGE: STAGE,
        CLOUDFLARE: 1,
      },
    })
    yield* PrPreviewComment({ name: "Docs", url })
  }),
)
