import { Data } from "effect"

export class PayloadMakeError extends Data.TaggedError("PayloadMakeError")<{}> {}
