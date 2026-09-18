import { type Effect, Data } from "effect"

import type { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"

export type Select = (required: Required) => Effect.Effect<Requirements, SelectError>

export class SelectError extends Data.TaggedError("SelectError")<{ readonly cause?: unknown }> {}

export declare const fromPredicate: (f: (required: Requirements) => boolean) => [Select][0]
