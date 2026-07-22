import { Data } from "effect"

export class SvmProtocolError extends Data.TaggedError("SvmProtocolError")<{
  readonly message: string
  readonly cause?: unknown
}> {}
