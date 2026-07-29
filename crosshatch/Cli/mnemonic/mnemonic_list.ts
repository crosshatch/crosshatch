import { Console, Effect } from "effect"
import { Command } from "effect/unstable/cli"

import { MnemonicStore } from "../../MnemonicStore.ts"

export const mnemonicList = Command.make("list").pipe(
  Command.withDescription("List stored mnemonics"),
  Command.withHandler(
    Effect.fn(function* () {
      const store = yield* MnemonicStore
      const mnemonics = yield* store.list
      yield* Console.log(
        JSON.stringify(
          Object.entries(mnemonics).map(([name, { addresses, dateAdded, description }]) => ({
            name,
            addresses,
            ...(dateAdded && { dateAdded: dateAdded.toISOString() }),
            ...(description && { description }),
          })),
        ),
      )
    }),
  ),
)
