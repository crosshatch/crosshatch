import { Schema as S } from "effect"

export type FieldsRecord = Record<string, S.Struct.Fields>

export declare namespace FieldsRecord {
  export type TaggedMember<T extends FieldsRecord, K extends keyof T = keyof T> = {
    [K_ in K]: { readonly _tag: K_ } & S.Struct<T[K_]>["Type"]
  }[K]
}
