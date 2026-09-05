import { Data, type Schema as S, type Effect } from "effect"

import type { Requirements } from "./Requirements.ts"

export type Adapt<Extra, R> = (input: { readonly extra: Extra; readonly accepted: Requirements }) => AdaptEffect<R>

export type AdaptEffect<R> = Effect.Effect<S.JsonObject, AdaptError, R>

export class AdaptError extends Data.TaggedError("AdaptError")<{}> {}
