import { Schema as S } from "effect"

export type Symmetric = typeof Symmetric.Type
export const Symmetric = S.Struct({
  cv: S.Uint8Array,
  iv: S.Uint8Array,
})

export type Asymmetric = typeof Asymmetric.Type
export const Asymmetric = S.Struct({
  encrypter: S.Uint8Array,
  ...Symmetric.fields,
})
