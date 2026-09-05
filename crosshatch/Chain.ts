import { Schema as S, SchemaGetter, type Pipeable, Predicate } from "effect"

import * as Proto from "./_Proto.ts"
import * as Namespace from "./Namespace.ts"
import * as Reference from "./Reference.ts"

const TypeId = Proto.id("Chain")

export type ChainFields = typeof ChainFields.Type
export const ChainFields = S.Struct({
  namespace: Namespace.NamespaceString,
  reference: Reference.ReferenceString,
})

export interface Chain extends ChainFields, Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId
}

export const isChain = (v: unknown): v is Chain => Predicate.hasProperty(v, TypeId)

export const make = (v: ChainFields): Chain => ({ ...Proto.make(TypeId), ...v })

export const ChainFromString = S.TemplateLiteralParser([
  Namespace.NamespaceString,
  ":",
  Reference.ReferenceString,
]).pipe(
  S.decodeTo(S.declare(isChain), {
    decode: SchemaGetter.transform(([namespace, _1, reference]) => make({ namespace, reference })),
    encode: SchemaGetter.transform(({ namespace, reference }) => [namespace, ":", reference]),
  }),
)
