import { Config, Effect, flow, Option, Schema, Struct } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Dev from "../Dev/Dev.ts"

export const dev = Command.make("dev", {
  hostname: Flag.string("hostname").pipe(Flag.optional, Flag.map(Option.getOrUndefined)),
  port: Flag.integer("port").pipe(Flag.withSchema(Config.Port), Flag.optional, Flag.map(Option.getOrUndefined)),
  otelEndpoint: Flag.string("otel-endpoint").pipe(
    Flag.withSchema(Schema.URLFromString),
    Flag.optional,
    Flag.withDescription("Export dev server logs and traces to an OTLP/HTTP endpoint"),
    Flag.map(flow(Option.map(Struct.get("href")), Option.getOrUndefined)),
  ),
}).pipe(Command.withHandler((config) => Dev.serve(config).pipe(Effect.andThen(Effect.never))))
