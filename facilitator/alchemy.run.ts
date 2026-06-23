import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Config, Effect, Layer } from "effect"
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
    const CROSSHATCH_STAGE = yield* Alchemy.Stage
    const { url } = yield* Cloudflare.Worker("Entry", {
      ...base,
      main: "main.ts",
      env: {
        CROSSHATCH_STAGE,
        CDP_API_KEY_ID: Config.string("CDP_API_KEY_ID"),
        CDP_API_KEY_SECRET: Config.redacted("CDP_API_KEY_SECRET"),
        OTEL_EXPORTER_OTLP_ENDPOINT: Config.string("OTEL_EXPORTER_OTLP_ENDPOINT"),
        OTEL_EXPORTER_OTLP_HEADERS: Config.redacted("OTEL_EXPORTER_OTLP_HEADERS"),
        OTEL_LOGS_EXPORTER: "otlp",
        OTEL_METRICS_EXPORTER: CROSSHATCH_STAGE.startsWith("dev_") ? "none" : "otlp",
        OTEL_TRACES_EXPORTER: "otlp",
      },
    })
    yield* PrPreviewComment({ name: "Facilitator", url })
  }),
)
