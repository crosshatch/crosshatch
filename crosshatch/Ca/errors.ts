import { Data } from "effect"

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause?: unknown }> {}
