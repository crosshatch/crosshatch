#!/usr/bin/env node

import { NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"
import { Command } from "effect/unstable/cli"

import PackageJson from "../package.json" with { type: "json" }
import { dev } from "./dev/dev.ts"
import { PreludeLive } from "./PreludeLive.ts"
import { profile } from "./profile.ts"

Command.make("crosshatch").pipe(
  Command.withSubcommands([profile, dev]),
  Command.run({
    version: PackageJson.version,
  }),
  Effect.provide(PreludeLive),
  Effect.onError(Effect.logError),
  NodeRuntime.runMain,
)
