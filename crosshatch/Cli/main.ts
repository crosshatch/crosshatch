#!/usr/bin/env node

import { NodeRuntime, NodeServices, NodeHttpClient } from "@effect/platform-node"
import { Console, Effect, Layer } from "effect"
import { Command } from "effect/unstable/cli"

import PackageJson from "../package.json" with { type: "json" }
import * as PrintableError from "../PrintableError.ts"
import { RampClient } from "../Ramp/Ramp.ts"
import { dev } from "./dev/dev.ts"
import { facilitator } from "./facilitator/facilitator.ts"
import { mnemonic } from "./mnemonic/mnemonic.ts"
import { payload } from "./payload/payload.ts"
import { ramp } from "./ramp/ramp.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([dev, payload, facilitator, mnemonic, ramp]),
  Command.run({ version: PackageJson.version }),
  Effect.catchIf(PrintableError.is, (cause) => Console.error(cause.message).pipe(Effect.andThen(Effect.fail(cause)))),
  Effect.scoped,
  Effect.provide([RampClient.layer.pipe(Layer.provideMerge(NodeHttpClient.layerFetch)), NodeServices.layer]),
  NodeRuntime.runMain,
)
