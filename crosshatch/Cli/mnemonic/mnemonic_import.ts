import { Effect, Console, Redacted, Option } from "effect"
import { Command, Argument, Flag, Prompt } from "effect/unstable/cli"

import * as Mnemonic from "../../Mnemonic.ts"
import { MnemonicStore } from "../../MnemonicStore.ts"
import * as DerivedAddresses from "../../Unified/DerivedAddresses.ts"
import * as Input from "./../Input.ts"

export const mnemonicImport = Command.make("import", {
  name: Argument.string("name").pipe(Argument.withDefault("default")),
  stdin: Flag.boolean("stdin").pipe(Flag.withDescription("Read the mnemonic from standard input instead of prompting")),
  description: Flag.string("description").pipe(Flag.optional, Flag.map(Option.getOrUndefined)),
}).pipe(
  Command.withDescription("Import and store a mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ name, stdin, description }) {
      const mnemonic = stdin
        ? yield* Input.stdin.pipe(Effect.map(Mnemonic.fromText))
        : yield* Prompt.password({ message: "Enter the mnemonic:" }).pipe(
            Effect.map((mnemonic) => Mnemonic.fromText(Redacted.value(mnemonic))),
          )
      const store = yield* MnemonicStore
      yield* store.add({ name, mnemonic, description })
      const addresses = yield* DerivedAddresses.fromMnemonic(mnemonic)
      yield* Console.log(JSON.stringify({ name, addresses }))
    }),
  ),
)
