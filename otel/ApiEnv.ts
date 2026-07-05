import { Layer, Context, Config } from "effect"

export const ApiEnvConfig = Config.all({
  OTEL_EXPORTER_OTLP_ENDPOINT: Config.string("OTEL_EXPORTER_OTLP_ENDPOINT"),
  OTEL_EXPORTER_OTLP_HEADERS: Config.redacted("OTEL_EXPORTER_OTLP_HEADERS"),
})

export class ApiEnv extends Context.Service<ApiEnv, Config.Success<typeof ApiEnvConfig>>()(
  "otel.crosshatch.dev/ApiEnv",
) {
  static readonly layer = Layer.effect(this, ApiEnvConfig)
}
