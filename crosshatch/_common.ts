import { Schema as S } from "effect"

export const brand = <K extends string>(key: K) => S.brand(`crosshatch/${key}`)
