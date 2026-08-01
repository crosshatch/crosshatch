import { Schema as S } from "effect"

export class TerminatedError extends S.TaggedErrorClass<TerminatedError>()("TerminatedError", {}) {}
