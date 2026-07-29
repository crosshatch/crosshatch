import { Effect, Console, Option } from "effect"
import { Command, Argument, Flag } from "effect/unstable/cli"

import * as Mnemonic from "../../Mnemonic.ts"
import { MnemonicStore } from "../../MnemonicStore.ts"
import * as DerivedAddresses from "../../Unified/DerivedAddresses.ts"

export const mnemonicAdd = Command.make("add", {
  name: Argument.string("name").pipe(Argument.withDefault("default")),
  description: Flag.string("description").pipe(Flag.optional, Flag.map(Option.getOrUndefined)),
}).pipe(
  Command.withDescription("Generate and store a mnemonic"),
  Command.withHandler(
    Effect.fn(function* ({ name, description }) {
      const mnemonic = yield* Mnemonic.random
      const store = yield* MnemonicStore
      yield* store.add({ name, mnemonic, description })
      const addresses = yield* DerivedAddresses.fromMnemonic(mnemonic)
      yield* Console.log(JSON.stringify({ name, addresses }))
    }),
  ),
)
