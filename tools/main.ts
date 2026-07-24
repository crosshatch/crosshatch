import { NodeServices } from "@effect/platform-node"
import { Effect } from "effect"
import { Command } from "effect/unstable/cli"

import { solanaFixtures } from "./solana-fixtures.ts"

Command.make("crosshatch-tools").pipe(
  Command.withSubcommands([solanaFixtures]),
  Command.run({ version: "internal" }),
  Effect.provide(NodeServices.layer),
  Effect.runFork,
)
