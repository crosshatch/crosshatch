import { Config, Schema, Option, flow, Struct } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Dev from "../Dev/Dev.ts"

export const dev = Command.make("dev", {
  hostname: Flag.string("hostname").pipe(Flag.withDefault("127.0.0.1")),
  port: Flag.integer("port").pipe(Flag.withSchema(Config.Port), Flag.withDefault(4647)),
  otelEndpoint: Flag.string("otel-endpoint").pipe(
    Flag.withSchema(Schema.URLFromString),
    Flag.optional,
    Flag.withDescription("Export dev server logs and traces to an OTLP/HTTP endpoint"),
    Flag.map(flow(Option.map(Struct.get("href")), Option.getOrUndefined)),
  ),
}).pipe(Command.withHandler(Dev.serve))
