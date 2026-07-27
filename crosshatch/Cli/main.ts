#!/usr/bin/env node

import { NodeRuntime, NodeServices, NodeHttpClient } from "@effect/platform-node"
import { Console, Effect, Layer, Predicate } from "effect"
import { Command } from "effect/unstable/cli"

import PackageJson from "../package.json" with { type: "json" }
import { RampClient } from "../Ramp/RampClient.ts"
import * as CliError from "./CliError.ts"
import { dev } from "./dev.ts"
import { profile } from "./profile.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([dev, profile]),
  Command.run({ version: PackageJson.version }),
  Effect.catchIf(Predicate.hasProperty(CliError.TypeId), (cause) =>
    Console.error(cause.message).pipe(Effect.andThen(Effect.fail(cause))),
  ),
  Effect.scoped,
  Effect.provide([RampClient.layer.pipe(Layer.provideMerge(NodeHttpClient.layerFetch)), NodeServices.layer]),
  NodeRuntime.runMain,
)
