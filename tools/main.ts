import { NodeServices } from "@effect/platform-node"
import { Effect } from "effect"
import { Command } from "effect/unstable/cli"

import { foo } from "./foo.ts"

Command.make("crosshatch-tools").pipe(
  Command.withSubcommands([foo]),
  Command.run({ version: "internal" }),
  Effect.provide(NodeServices.layer),
  Effect.runFork,
)
