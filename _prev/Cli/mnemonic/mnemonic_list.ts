import { Console, Effect, Schema as S } from "effect"
import { Command } from "effect/unstable/cli"

import { MnemonicStore } from "../../MnemonicStore.ts"
import { MnemonicConfigs } from "../../UserConfig.ts"

export const mnemonicList = Command.make("list").pipe(
  Command.withDescription("List stored mnemonics"),
  Command.withHandler(
    Effect.fn(function* () {
      const store = yield* MnemonicStore
      yield* store.list.pipe(
        Effect.flatMap(S.encodeEffect(S.toCodecJson(MnemonicConfigs))),
        Effect.map((v) => JSON.stringify(v, null, 2)),
        Effect.andThen(Console.log),
      )
    }),
  ),
)
