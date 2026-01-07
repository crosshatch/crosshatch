import { Schema as S } from "effect"

export const brandedId = <B extends symbol>(brand: B) => S.UUID.pipe(S.brand(brand))
