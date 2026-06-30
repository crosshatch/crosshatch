import { Command } from "effect/unstable/cli"

import { profileAdd } from "./profile_add.ts"
import { profileRevealMnemonic } from "./profile_reveal-mnemonic.ts"

export const profile = Command.make("profile").pipe(Command.withSubcommands([profileAdd, profileRevealMnemonic]))
