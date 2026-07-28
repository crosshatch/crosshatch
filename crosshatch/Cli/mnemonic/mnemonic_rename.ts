import { Effect } from "effect"
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli"

import * as MnemonicStore from "../../Host/MnemonicStore.ts"

export const mnemonicRename = Command.make("rename", {
  name: Argument.string("name"),
  newName: Argument.string("new-name"),
  yes: Flag.boolean("yes").pipe(Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Rename a stored mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ name, newName, yes }) {
      if (!yes && !(yield* Prompt.confirm({ message: `Rename mnemonic "${name}" to "${newName}"?` }))) return
      yield* MnemonicStore.rename(name, newName)
    }),
  ),
)
