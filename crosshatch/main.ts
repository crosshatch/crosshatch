#!/usr/bin/env node

import { NodeServices } from "@effect/platform-node"
import { Cause, Effect } from "effect"
import { Command } from "effect/unstable/cli"
import { FetchHttpClient } from "effect/unstable/http"

import { profile } from "./commands/profile.ts"
import PackageJson from "./package.json" with { type: "json" }
import { RampClient } from "./Ramp/RampClient.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([profile]),
  Command.run({
    version: PackageJson.version,
  }),
  Effect.provide([NodeServices.layer, RampClient.layer]),
  Effect.provide(FetchHttpClient.layer),
  Effect.onError((cause) => Effect.logError(Cause.pretty(cause))),
  Effect.runFork,
)
