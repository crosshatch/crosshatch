import { Console, Effect } from "effect"
import { Command } from "effect/unstable/cli"

import * as MnemonicStore from "../../Host/MnemonicStore.ts"

export const mnemonicList = Command.make("list").pipe(
  Command.withDescription("List stored mnemonics"),
  Command.withHandler(
    Effect.fn(function* () {
      const mnemonics = yield* MnemonicStore.list
      yield* Console.log(
        JSON.stringify(
          Object.entries(mnemonics).map(([name, { address, dateAdded, description }]) => ({
            name,
            address,
            ...(dateAdded && { dateAdded: dateAdded.toISOString() }),
            ...(description && { description }),
          })),
        ),
      )
    }),
  ),
)
