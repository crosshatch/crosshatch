import { Console, Effect, Redacted } from "effect"
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli"

import * as MnemonicStore from "../../Host/MnemonicStore.ts"

export const mnemonicReveal = Command.make("reveal", {
  name: Argument.string("name").pipe(Argument.withDefault("default")),
  yes: Flag.boolean("yes").pipe(Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Reveal a stored mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ name, yes }) {
      if (
        !yes &&
        !(yield* Prompt.confirm({ message: `Reveal mnemonic "${name}"? It will be printed to standard output.` }))
      ) {
        return
      }
      const mnemonic = yield* MnemonicStore.get(name)
      yield* Console.log(Redacted.value(mnemonic))
    }),
  ),
)
