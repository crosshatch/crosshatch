import { Config, Layer, Context } from "effect"

export class FacilitatorEnv extends Context.Service<FacilitatorEnv>()("FacilitatorEnv", {
  make: Config.all({
    ALCHEMY_STAGE: Config.string("ALCHEMY_STAGE"),
    CDP_API_KEY_ID: Config.string("CDP_API_KEY_ID"),
    CDP_API_KEY_SECRET: Config.redacted("CDP_API_KEY_SECRET"),
    OTEL_EXPORTER_OTLP_ENDPOINT: Config.string("OTEL_EXPORTER_OTLP_ENDPOINT"),
    OTEL_EXPORTER_OTLP_HEADERS: Config.redacted("OTEL_EXPORTER_OTLP_HEADERS"),
  }),
}) {
  static readonly layer = Layer.effect(this, this.make)
}
