import { Schema as S, SchemaTransformation } from "effect"

export const makeId = <B extends string>(identifier: B) =>
  S.String.check(S.isUUID()).pipe(S.brand(identifier), S.annotate({ identifier }))

export const UnknownRecord = S.Record(S.String, S.Unknown)

export const ArrayBuffer_ = S.Uint8ArrayFromBase64.pipe(
  S.decodeTo(
    S.instanceOf(ArrayBuffer),
    SchemaTransformation.transform({
      decode: (u8a) => {
        const a = new ArrayBuffer(u8a.byteLength)
        new Uint8Array(a).set(u8a)
        return a
      },
      encode: (ab) => new Uint8Array(ab),
    }),
  ),
)
