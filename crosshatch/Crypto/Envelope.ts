import { Schema as S } from "effect"

export const Symmetric = S.Struct({
  cv: S.Uint8Array,
  iv: S.Uint8Array,
})

export const Asymmetric = S.Struct({
  encrypter: S.Uint8Array,
  ...Symmetric.fields,
})
