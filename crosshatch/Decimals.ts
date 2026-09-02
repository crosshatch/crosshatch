import { Schema as S, Effect } from "effect"

/**
 * Upper bound on {@link Decimals}. ERC-20 `decimals` is `uint8`; converting
 * at a larger scale would also make `10n ** BigInt(decimals)` unbounded.
 */
export const MAX_DECIMALS = 255

export type Decimals = typeof Decimals.Type
export const Decimals = S.Natural.check(S.isLessThanOrEqualTo(MAX_DECIMALS)).pipe(S.brand("crosshatch/Decimals"))

const decodeEffect = S.decodeEffect(Decimals, { reportInput: true })
export const fromNumber: (input: number) => Effect.Effect<Decimals, S.SchemaError> = (input) => decodeEffect(input)
