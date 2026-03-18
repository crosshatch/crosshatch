import { Schema as S } from "effect"

import { AbsurdError } from "./errors.ts"

export type { AnyTaggedRequestSchema as RequestDefinition } from "@effect/ai/Tool"

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

export const taggedLiterals = <A extends { _tag: string }, I, R>(schema: S.Schema<A, I, R>) => {
  const { ast } = S.encodedBoundSchema(schema)
  if (ast._tag !== "Union") {
    throw new AbsurdError()
  }
  return ast.types.map((member) => {
    if (member._tag !== "TypeLiteral") {
      throw new AbsurdError()
    }
    const tagPropertySignature = member.propertySignatures.find(({ name }) => name === "_tag")?.type
    if (!tagPropertySignature) {
      throw new AbsurdError()
    }
    if (tagPropertySignature._tag !== "Literal" || typeof tagPropertySignature.literal !== "string") {
      throw new AbsurdError()
    }
    return tagPropertySignature.literal
  }) as never as [A["_tag"], ...Array<A["_tag"]>]
}

export type Fields = Record<keyof any, S.Struct.Field>

export type FieldsRecord = Record<string, Fields>

export declare namespace FieldsRecord {
  export type TaggedMember<T extends FieldsRecord, K extends keyof T = keyof T> = {
    [K_ in K]: { readonly _tag: K_ } & S.Struct<T[K_]>["Type"]
  }[K]
}
