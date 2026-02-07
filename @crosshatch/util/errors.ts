import { Data } from "effect"

export class UnimplementedError extends Data.TaggedError("UnimplementedError")<{}> {}

export class AbsurdError extends Data.TaggedError("AbsurdError")<{}> {}
