import { Console, Effect, flow, Redacted } from "effect"
import { Argument, Command, Flag, Prompt } from "effect/unstable/cli"

import { MnemonicStore } from "../../MnemonicStore.ts"

export const mnemonicReveal = Command.make("reveal", {
  name: Argument.String("name").pipe(Argument.withDefault("default")),
  yes: Flag.Boolean("yes").pipe(Flag.withDefault(false), Flag.withAlias("y")),
}).pipe(
  Command.withDescription("Reveal a stored mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ name, yes }) {
      if (
        !yes &&
        !(yield* Prompt.Confirm({ message: `Reveal mnemonic "${name}"? It will be printed to standard output.` }))
      ) {
        yield* Console.log("Operation cancelled.")
        return
      }
      const store = yield* MnemonicStore
      yield* store.get(name).pipe(Effect.flatMap(flow(Redacted.value, Console.log)))
    }),
  ),
)
