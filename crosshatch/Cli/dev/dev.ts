import { Config, Effect, flow, Option, Schema, Struct } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Dev from "../../Dev/index.ts"

export const dev = Command.make("dev", {
  hostname: Flag.string("hostname").pipe(Flag.withDefault(undefined)),
  port: Flag.integer("port").pipe(Flag.withSchema(Config.Port), Flag.withDefault(undefined)),
  otelEndpoint: Flag.string("otel-endpoint").pipe(
    Flag.withSchema(Schema.URLFromString),
    Flag.optional,
    Flag.withDescription("Export dev server logs and traces to an OTLP/HTTP endpoint"),
    Flag.map(flow(Option.map(Struct.get("href")), Option.getOrUndefined)),
  ),
}).pipe(
  Command.withDescription("Run the local Crosshatch development server"),
  Command.withHandler((config) => Dev.serve(config).pipe(Effect.andThen(Effect.never))),
)
