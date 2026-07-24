import { Data, Effect } from "effect"

export class SvmProtocolError extends Data.TaggedError("SvmProtocolError")<{
  readonly message?: string
  readonly cause?: unknown
}> {}

export const ensure = (condition: boolean, message: string): Effect.Effect<void, SvmProtocolError> =>
  condition ? Effect.void : Effect.fail(new SvmProtocolError({ message }))
