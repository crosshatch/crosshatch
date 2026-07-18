import { Layer, UndefinedOr } from "effect"
import { OtlpLogger, OtlpSerialization, OtlpTracer } from "effect/unstable/observability"

import * as PackageJson from "../package.json" with { type: "json" }

export const layer = (otelEndpoint: string | undefined) =>
  UndefinedOr.match(otelEndpoint, {
    onUndefined: () => Layer.empty,
    onDefined: (baseUrl) => {
      const resource = {
        serviceName: "crosshatch-dev",
        serviceVersion: PackageJson.version,
      }
      return Layer.mergeAll(
        OtlpLogger.layer({
          url: `${baseUrl}/v1/logs`,
          resource,
        }),
        OtlpTracer.layer({
          url: `${baseUrl}/v1/traces`,
          resource,
        }),
      ).pipe(Layer.provide(OtlpSerialization.layerJson))
    },
  })
