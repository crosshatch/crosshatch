import { Schema as S, flow } from "effect"

export type TopFromString = S.Codec<any, string, any, any>

const toJsonStringCodec = flow(S.toCodecJson, S.fromJsonString)
export const encodeJsonString = flow(toJsonStringCodec, S.encodeEffect)
export const decodeJsonString = flow(toJsonStringCodec, S.decodeUnknownEffect)

export type JsonRecord = typeof JsonRecord.Type
export const JsonRecord = S.Record(S.String, S.Json)
