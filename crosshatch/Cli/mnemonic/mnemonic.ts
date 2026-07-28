import { Command } from "effect/unstable/cli"

import { mnemonicAdd } from "./mnemonic_add.ts"
import { mnemonicImport } from "./mnemonic_import.ts"
import { mnemonicList } from "./mnemonic_list.ts"
import { mnemonicRemove } from "./mnemonic_remove.ts"
import { mnemonicRename } from "./mnemonic_rename.ts"
import { mnemonicReveal } from "./mnemonic_reveal.ts"

export const mnemonic = Command.make("mnemonic").pipe(
  Command.withDescription("Manage encrypted mnemonics"),
  Command.withSubcommands([mnemonicAdd, mnemonicImport, mnemonicList, mnemonicReveal, mnemonicRemove, mnemonicRename]),
)
