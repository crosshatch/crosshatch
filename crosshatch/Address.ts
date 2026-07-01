import { Schema as S } from "effect"

export const Address = S.String.pipe(S.brand("crosshatch/Address"))
