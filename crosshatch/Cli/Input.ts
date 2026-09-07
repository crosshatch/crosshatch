import { Data, Effect, Option, Stdio, Stream, String } from "effect"

export class ConflictingSourcesError extends Data.TaggedError("ConflictingInputSourcesError")<{
  readonly name: string
}> {
  override get message() {
    return `The ${this.name} argument cannot be combined with --stdin.`
  }
}

export class MissingError extends Data.TaggedError("MissingInputError")<{ readonly name: string }> {
  override get message() {
    return `The ${this.name} argument or --stdin is required.`
  }
}

export const stdin = Effect.gen(function* () {
  const stdio = yield* Stdio.Stdio
  return yield* stdio.stdin.pipe(
    Stream.decodeText,
    Stream.runFold(
      () => "",
      (all, chunk) => all + chunk,
    ),
    Effect.map(String.trim),
  )
})

export const read = Effect.fn(function* (input: Option.Option<string>, fromStdin: boolean, name: string) {
  if (fromStdin && input._tag === "Some") {
    return yield* new ConflictingSourcesError({ name })
  }
  if (fromStdin) return yield* stdin
  return yield* Option.match(input, {
    onNone: () => new MissingError({ name }),
    onSome: Effect.succeed,
  })
})
