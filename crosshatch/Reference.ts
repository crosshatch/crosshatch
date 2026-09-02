import { Schema as S } from "effect"

import { brand } from "./_common.ts"

export type Reference = typeof Reference.Type
export const Reference = S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u)).pipe(brand("Reference"))

export const decodeEffect = S.decodeEffect(Reference)
