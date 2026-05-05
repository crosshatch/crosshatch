import { Layer, Redacted } from "effect"
import { OtlpLogger, OtlpMetrics, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"

export const layerOtlp = ({
  OTEL_EXPORTER_OTLP_ENDPOINT,
  OTEL_SERVICE_NAME,
  SIGNOZ_INGESTION_KEY,
  DEV,
}: {
  DEV: boolean
  OTEL_EXPORTER_OTLP_ENDPOINT: string
  OTEL_SERVICE_NAME: string
  SIGNOZ_INGESTION_KEY: Redacted.Redacted
}) =>
  Layer.mergeAll(
    OtlpTracer.layer({
      url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
      resource: { serviceName: OTEL_SERVICE_NAME },
      headers: { "signoz-ingestion-key": Redacted.value(SIGNOZ_INGESTION_KEY) },
    }),
    OtlpLogger.layer({
      url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
      resource: { serviceName: OTEL_SERVICE_NAME },
      headers: { "signoz-ingestion-key": Redacted.value(SIGNOZ_INGESTION_KEY) },
    }),
    DEV
      ? Layer.empty
      : OtlpMetrics.layer({
          url: `${OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
          resource: { serviceName: OTEL_SERVICE_NAME },
          headers: { "signoz-ingestion-key": Redacted.value(SIGNOZ_INGESTION_KEY) },
        }),
  ).pipe(Layer.provide(OtlpSerialization.layerJson))
