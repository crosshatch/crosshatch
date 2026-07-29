import { Data, Effect, Option, Stdio, Stream, String } from "effect"

import * as PrintableError from "../PrintableError.ts"

export class StdinReadError extends PrintableError.make(
  Data.TaggedError("StdinReadError")<{ readonly cause: unknown }>,
  ({ cause }) => `Could not read standard input: ${globalThis.String(cause)}`,
) {}

export class ConflictingSourcesError extends PrintableError.make(
  Data.TaggedError("ConflictingInputSourcesError")<{ readonly name: string }>,
  ({ name }) => `The ${name} argument cannot be combined with --stdin.`,
) {}

export class MissingError extends PrintableError.make(
  Data.TaggedError("MissingInputError")<{ readonly name: string }>,
  ({ name }) => `The ${name} argument or --stdin is required.`,
) {}

export class InvalidError extends PrintableError.make(
  Data.TaggedError("InvalidInputError")<{ readonly name: string; readonly cause: unknown }>,
  ({ name, cause }) => `Invalid ${name}: ${globalThis.String(cause)}`,
) {}

export const stdin = Effect.gen(function* () {
  const stdio = yield* Stdio.Stdio
  return yield* stdio.stdin.pipe(
    Stream.decodeText,
    Stream.runFold(
      () => "",
      (all, chunk) => all + chunk,
    ),
    Effect.map(String.trim),
    Effect.mapError((cause) => new StdinReadError({ cause })),
  )
})

export const read = Effect.fn(function* (input: Option.Option<string>, fromStdin: boolean, name: string) {
  if (fromStdin && Option.isSome(input)) {
    return yield* new ConflictingSourcesError({ name })
  }
  if (fromStdin) return yield* stdin
  return yield* Option.match(input, {
    onNone: () => new MissingError({ name }),
    onSome: Effect.succeed,
  })
})
