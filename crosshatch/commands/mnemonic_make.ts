import { Effect, Console, Redacted, Data } from "effect"
import { Command, Argument } from "effect/unstable/cli"

import * as Mnemonic from "../Mnemonic.ts"
import * as UserConfig from "./UserConfig.ts"

export class MnemonicNameExistsError extends Data.TaggedError("MnemonicNameExistsError")<{}> {}

export const mnemonicMake = Command.make("make", {
  name: Argument.string("name").pipe(Argument.withDefault("default")),
}).pipe(
  Command.withHandler(
    Effect.fn(function* ({ name }) {
      let config = yield* UserConfig.read
      if (config) {
        if (name in config.mnemonics) {
          return yield* new MnemonicNameExistsError()
        }
      } else {
        config = { mnemonics: {} }
      }
      const mnemonic = yield* Mnemonic.random
      config.mnemonics[name] = mnemonic
      yield* UserConfig.write(config)
      yield* Console.log(Redacted.value(mnemonic))
    }),
  ),
)
