import { nonNullable, nullableError } from "@crosshatch/util/unwrapping"
import { TaggedTransactionRollbackError } from "drizzle-orm/effect-core"
import { Effect } from "effect"

export const txNonNullable = <A, E, R>(x: Effect.Effect<A, E, R>) =>
  x.pipe(
    nonNullable,
    nullableError(TaggedTransactionRollbackError),
  )
