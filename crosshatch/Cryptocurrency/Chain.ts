import { Schema as S, SchemaGetter } from "effect"

import { NamespaceString } from "./NamespaceString.ts"
import { ReferenceString } from "./ReferenceString.ts"

export const ChainPartsFromString = S.TemplateLiteralParser([NamespaceString, ":", ReferenceString])

export class Chain extends S.Class<Chain>("Chain")({
  namespace: NamespaceString,
  reference: ReferenceString,
}) {}

export const ChainFromString = ChainPartsFromString.pipe(
  S.decodeTo(S.toType(Chain), {
    decode: SchemaGetter.transform(([namespace, _1, reference]) => ({ namespace, reference })),
    encode: SchemaGetter.transform((v) => [v.namespace, ":", v.reference]),
  }),
)
