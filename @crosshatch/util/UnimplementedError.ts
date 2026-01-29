import { Data } from "effect"

export class UnimplementedError extends Data.TaggedError("UnimplementedError")<{}> {}
