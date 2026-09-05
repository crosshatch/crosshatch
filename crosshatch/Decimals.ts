import { Schema as S, type Effect } from "effect"

import { id } from "./_Proto.ts"

/** Upper bound on {@link Decimals}; converting at a larger scale would also make `10n ** BigInt(decimals)` unbounded. */
export const MAX_DECIMALS = 255

export type Decimals = typeof Decimals.Type
export const Decimals = S.Natural.check(S.isLessThanOrEqualTo(MAX_DECIMALS)).pipe(S.brand(id("Decimals")))

const decodeEffect = S.decodeEffect(Decimals, { reportInput: true })
export const fromNumber = (input: number): Effect.Effect<Decimals, S.SchemaError> => decodeEffect(input)
