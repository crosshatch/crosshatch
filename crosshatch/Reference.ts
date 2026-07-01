import { Schema as S } from "effect"

/** CAIP-2 reference — identifies a chain within a namespace. */
export const Reference = S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/)).pipe(S.brand("crosshatch/Reference"))
