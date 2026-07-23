import { Console, Effect } from "effect"
import { Command } from "effect/unstable/cli"

export const foo = Command.make("foo", {}).pipe(
  Command.withHandler(
    Effect.fn(function* () {
      yield* Console.log("FOO")
    }),
  ),
)
