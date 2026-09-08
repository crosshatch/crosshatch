import { Schema as S, type Effect } from "effect"

import { id } from "./_Proto.ts"

/** Supported asset precision, not a monetary magnitude or input-size limit. Bounds exponent expansion; coefficients remain arbitrary-size. */
export const MAX_DECIMALS = 255

export type Decimals = typeof Decimals.Type
export const Decimals = S.Natural.check(S.isLessThanOrEqualTo(MAX_DECIMALS)).pipe(S.brand(id("Decimals")))

const decodeEffect = S.decodeEffect(Decimals, { reportInput: true })
export const fromNumber = (input: number): Effect.Effect<Decimals, S.SchemaError> => decodeEffect(input)
