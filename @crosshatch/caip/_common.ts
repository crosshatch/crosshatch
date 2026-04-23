import { Schema as S } from "effect"

export const brander =
  <N extends number>(n: N) =>
  <K extends string>(key: K) =>
    S.brand(`Caip.${n}.${key}`)
