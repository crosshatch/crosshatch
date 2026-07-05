#!/usr/bin/env node

import { Cause, Effect } from "effect"
import { Command } from "effect/unstable/cli"

import PackageJson from "../package.json" with { type: "json" }
import { PreludeLive } from "./PreludeLive.ts"
import { profile } from "./profile.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([profile]),
  Command.run({
    version: PackageJson.version,
  }),
  Effect.provide(PreludeLive),
  Effect.onError((cause) => Effect.logError(Cause.pretty(cause))),
  Effect.runFork,
)
