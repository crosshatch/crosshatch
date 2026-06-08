import { NodeServices } from "@effect/platform-node"
import { Effect } from "effect"
import { Command } from "effect/unstable/cli"
import { FetchHttpClient } from "effect/unstable/http"

import { codegen } from "./codegen.ts"

Command.make("scripts").pipe(
  Command.withSubcommands([codegen]),
  Command.run({ version: "internal" }),
  Effect.scoped,
  Effect.provide([NodeServices.layer, FetchHttpClient.layer]),
  Effect.runFork,
)
