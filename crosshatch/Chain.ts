import { Schema as S, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"
import * as Namespace from "./Namespace.ts"
import * as Reference from "./Reference.ts"

const TypeId = Proto.id("Chain")

export const ChainPartsFromString = S.TemplateLiteralParser([Namespace.NamespaceString, ":", Reference.ReferenceString])

export class Chain extends S.Class<Chain>("Chain")({
  [TypeId]: S.tagDefaultOmit(TypeId),
  namespace: Namespace.NamespaceString,
  reference: Reference.ReferenceString,
}) {}

export const ChainFromString = ChainPartsFromString.pipe(
  S.decodeTo(Chain, {
    decode: SchemaGetter.transform(([namespace, _1, reference]) =>
      Chain.make({ namespace, reference }, { disableChecks: true }),
    ),
    encode: SchemaGetter.transform(({ namespace, reference }) =>
      ChainPartsFromString.make([namespace as never, ":", reference as never], { disableChecks: true }),
    ),
  }),
)
