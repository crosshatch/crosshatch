import { Schema as S } from "effect"

export const makeId = <B extends symbol>(brand: B, identifier: string) =>
  S.UUID.pipe(S.brand(brand), S.annotations({ identifier }))

export const UnknownRecord = S.Record({
  key: S.String,
  value: S.Unknown,
})

export const ArrayBuffer_ = S.transform(S.Uint8ArrayFromBase64, S.instanceOf(ArrayBuffer), {
  strict: true,
  encode: (ab) => new Uint8Array(ab),
  decode: (u8a) => {
    const a = new ArrayBuffer(u8a.byteLength)
    new Uint8Array(a).set(u8a)
    return a
  },
})
