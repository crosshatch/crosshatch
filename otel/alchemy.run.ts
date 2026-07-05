import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Config, Effect, Layer } from "effect"
import { PrPreviewComment } from "liminal-util/alchemicals/PrComment"
import { WorkerConfig } from "liminal-util/alchemicals/WorkerConfig"

export default Alchemy.Stack(
  "crosshatch-otel",
  {
    state: Cloudflare.state(),
    providers: Layer.mergeAll(Cloudflare.providers(), Github.providers()),
  },
  Effect.gen(function* () {
    const base = yield* WorkerConfig({
      domain: "otel.crosshatch.dev",
    })
    const CROSSHATCH_STAGE = yield* Alchemy.Stage
    const { url } = yield* Cloudflare.Worker("Entry", {
      ...base,
      dev: {
        host: "127.0.0.1",
        port: 1338,
        strictPort: true,
      },
      main: "main.ts",
      env: {
        CROSSHATCH_STAGE,
        OTEL_EXPORTER_OTLP_ENDPOINT: Config.string("OTEL_EXPORTER_OTLP_ENDPOINT"),
        OTEL_EXPORTER_OTLP_HEADERS: Config.redacted("OTEL_EXPORTER_OTLP_HEADERS"),
        OTEL_LOGS_EXPORTER: "otlp",
        OTEL_METRICS_EXPORTER: CROSSHATCH_STAGE.startsWith("dev_") ? "none" : "otlp",
        OTEL_TRACES_EXPORTER: "otlp",
      },
    })
    yield* PrPreviewComment({ name: "CLI Otel", url })
  }),
)
