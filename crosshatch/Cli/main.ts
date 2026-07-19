#!/usr/bin/env node

import { NodeRuntime, NodeServices, NodeHttpClient } from "@effect/platform-node"
import { Effect, Layer } from "effect"
import { Command } from "effect/unstable/cli"

import PackageJson from "../package.json" with { type: "json" }
import { RampClient } from "../Ramp/RampClient.ts"
import { dev } from "./dev.ts"
import { profile } from "./profile.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([dev, profile]),
  Command.run({ version: PackageJson.version }),
  Effect.scoped,
  Effect.provide([RampClient.layer.pipe(Layer.provideMerge(NodeHttpClient.layerFetch)), NodeServices.layer]),
  Effect.onError(Effect.logError),
  NodeRuntime.runMain,
)
