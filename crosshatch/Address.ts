import { Schema as S } from "effect"

export const brand = S.brand("crosshatch/Address")

export const Address = S.String.pipe(brand)
