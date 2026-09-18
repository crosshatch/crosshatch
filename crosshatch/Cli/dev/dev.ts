import { Effect, flow, Option, Schema } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Dev from "../../Dev/index.ts"

export const dev = Command.make("dev", {
  hostname: Flag.String("hostname").pipe(Flag.withDefault(undefined)),
  port: Flag.Int("port").pipe(Flag.withDefault(undefined)),
  otelEndpoint: Flag.String("otel-endpoint").pipe(
    Flag.withSchema(Schema.URLFromString),
    Flag.optional,
    Flag.withDescription("Export dev server logs and traces to an OTLP/HTTP endpoint"),
    Flag.map(
      flow(
        Option.map((v) => v.href),
        Option.getOrUndefined,
      ),
    ),
  ),
}).pipe(
  Command.withDescription("Run the local Crosshatch development server"),
  Command.withHandler((config) => Dev.serve(config).pipe(Effect.andThen(Effect.never))),
)
