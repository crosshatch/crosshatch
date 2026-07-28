import { Effect, Option, Stdio, Stream, String } from "effect"
import { CliError } from "effect/unstable/cli"

export const stdin = Effect.gen(function* () {
  const stdio = yield* Stdio.Stdio
  return yield* stdio.stdin.pipe(
    Stream.decodeText,
    Stream.runFold(
      () => "",
      (all, chunk) => all + chunk,
    ),
    Effect.map(String.trim),
    Effect.mapError((cause) => new CliError.UserError({ cause })),
  )
})

export const read = Effect.fn(function* (input: Option.Option<string>, fromStdin: boolean, name: string) {
  if (fromStdin && Option.isSome(input)) {
    return yield* new CliError.UserError({
      cause: new Error(`The ${name} argument cannot be combined with --stdin`),
    })
  }
  if (fromStdin) return yield* stdin
  return yield* Option.match(input, {
    onNone: () => new CliError.MissingArgument({ argument: `${name} or --stdin` }),
    onSome: Effect.succeed,
  })
})
