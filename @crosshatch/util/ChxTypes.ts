import type { Types } from "effect"

export const mutable = <T>(value: T): T extends ReadonlyArray<infer U> ? Array<U> : Types.Mutable<T> => value as never
