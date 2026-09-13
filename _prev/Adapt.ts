import { Data, type Schema as S, type Effect } from "effect"

import type { Requirements } from "./Requirements.ts"

export type Adapt<Extra, A extends S.JsonObject, R> = (input: {
  readonly extra: Extra
  readonly accepted: Requirements
}) => AdaptEffect<A, R>

export type AdaptEffect<A extends S.JsonObject, R> = Effect.Effect<A, AdaptError, R>

export class AdaptError extends Data.TaggedError("AdaptError")<{ readonly cause?: unknown }> {}
