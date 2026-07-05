import { NodeServices } from "@effect/platform-node"
import { Layer, Effect } from "effect"
import { FetchHttpClient } from "effect/unstable/http"
import { Otlp, OtlpLogger, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"

import { RampClient } from "../Ramp/RampClient.ts"
import { Stage } from "../Stage.ts"

const resource = { serviceName: "crosshatch-lib" }

export const OtlpLive = Stage.pipe(
  Effect.map(({ name, url }) =>
    name === "prod"
      ? Otlp.layer({
          baseUrl: url("cli-otel"),
          resource,
        })
      : Layer.mergeAll(
          OtlpLogger.layer({
            url: url("cli-otel", "otel/v1/logs"),
            resource,
          }),
          OtlpTracer.layer({
            url: url("cli-otel", "otel/v1/traces"),
            resource,
          }),
        ),
  ),
  Layer.unwrap,
  Layer.provide(OtlpSerialization.layerJson),
)

export const PreludeLive = Layer.mergeAll(OtlpLive, RampClient.layer).pipe(
  Layer.provideMerge([FetchHttpClient.layer, NodeServices.layer]),
)
