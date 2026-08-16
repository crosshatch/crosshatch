import { Schema as S, flow, Tuple, Struct } from "effect"

export type TopFromString = S.Codec<any, string, any, any>

const toJsonStringCodec = flow(S.toCodecJson, S.fromJsonString)
export const encodeJsonString = flow(toJsonStringCodec, S.encodeEffect)
export const decodeJsonString = flow(toJsonStringCodec, S.decodeUnknownEffect)

export type JsonRecord = typeof JsonRecord.Type
export const JsonRecord = S.Record(S.String, S.Json)

interface TagLiteral extends Struct.Lambda {
  (member: S.TaggedStruct<string, S.Struct.Fields>): string
  readonly "~lambda.out": this["~lambda.in"] extends {
    readonly fields: { readonly _tag: { readonly schema: { readonly literal: infer L } } }
  }
    ? L
    : never
}

export const getLiterals = Tuple.map(Struct.lambda<TagLiteral>((m) => m.fields._tag.schema.literal))
