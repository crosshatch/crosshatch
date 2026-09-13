import { Command } from "effect/unstable/cli"

import { payloadMake } from "./payload_make.ts"

export const payload = Command.make("payload").pipe(
  Command.withDescription("Create payment payloads"),
  Command.withSubcommands([payloadMake]),
)
