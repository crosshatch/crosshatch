import { Command } from "effect/unstable/cli"

import { mnemonicMake } from "./mnemonic_make.ts"

export const mnemonic = Command.make("mnemonic").pipe(Command.withSubcommands([mnemonicMake]))
