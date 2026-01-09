import { Schema as S } from "effect"

export const addressTypeId = Symbol()
export const Address = S.String.pipe(S.brand(addressTypeId))
export type Address = typeof Address["Type"]
