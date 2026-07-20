import { Data } from "effect"

export class SiwxError extends Data.TaggedError("SiwxError")<{ readonly cause?: unknown }> {}
