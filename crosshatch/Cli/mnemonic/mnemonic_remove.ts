import { Console, Effect } from "effect"
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli"

import { MnemonicStore } from "../../MnemonicStore.ts"

export const mnemonicRemove = Command.make("remove", {
  name: Argument.string("name").pipe(Argument.withDefault("default")),
  yes: Flag.boolean("yes").pipe(Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Remove a stored mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ name, yes }) {
      if (!yes && !(yield* Prompt.confirm({ message: `Remove mnemonic "${name}"?` }))) {
        yield* Console.log("Operation cancelled.")
        return
      }
      const store = yield* MnemonicStore
      yield* store.remove(name)
    }),
  ),
)
