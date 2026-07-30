import { Command } from "effect/unstable/cli"

import { settle } from "./facilitator_settle.ts"
import { supported } from "./facilitator_supported.ts"
import { verify } from "./facilitator_verify.ts"

export const facilitator = Command.make("facilitator").pipe(
  Command.withDescription("Interact with an x402 facilitator"),
  Command.withSubcommands([supported, verify, settle]),
)
