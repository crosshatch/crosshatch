import { Console, Effect } from "effect"
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli"

import { MnemonicStore } from "../../MnemonicStore.ts"

export const mnemonicRename = Command.make("rename", {
  from: Argument.string("from"),
  to: Argument.string("to"),
  yes: Flag.boolean("yes").pipe(Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Rename a stored mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ from, to, yes }) {
      if (!yes && !(yield* Prompt.confirm({ message: `Rename mnemonic "${from}" to "${to}"?` }))) {
        yield* Console.log("Operation cancelled.")
        return
      }
      const store = yield* MnemonicStore
      yield* store.rename(from, to)
    }),
  ),
)
