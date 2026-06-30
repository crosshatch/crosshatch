#!/usr/bin/env node

import { NodeServices } from "@effect/platform-node"
import { Cause, Effect } from "effect"
import { Command } from "effect/unstable/cli"

import { mnemonic } from "./commands/mnemonic.ts"
import PackageJson from "./package.json" with { type: "json" }

Command.make("crosshatch").pipe(
  Command.withSubcommands([mnemonic]),
  Command.run({
    version: PackageJson.version,
  }),
  Effect.provide(NodeServices.layer),
  Effect.onError((cause) => Effect.logError(Cause.pretty(cause))),
  Effect.runFork,
)
