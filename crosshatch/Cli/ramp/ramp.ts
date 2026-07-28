import { Command } from "effect/unstable/cli"

import { onramp } from "./ramp_onramp.ts"

export const ramp = Command.make("ramp").pipe(
  Command.withDescription("Create fiat onramp sessions"),
  Command.withSubcommands([onramp]),
)
