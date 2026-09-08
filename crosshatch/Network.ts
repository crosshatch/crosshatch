import { Schema as S, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"

export const NetworkPart = S.NonEmptyString.check(S.isPattern(/^[^:]+$/u)).pipe(S.brand(Proto.key("NetworkPart")))

export const NetworkPartsFromString = S.TemplateLiteralParser([NetworkPart, ":", NetworkPart])

export class Network extends S.Class<Network>("Network")({
  family: NetworkPart,
  reference: NetworkPart,
}) {}

export const NetworkFromString = NetworkPartsFromString.pipe(
  S.decodeTo(S.toType(Network), {
    decode: SchemaGetter.transform(([family, _1, reference]) => ({ family, reference })),
    encode: SchemaGetter.transform((v) => [v.family, ":", v.reference]),
  }),
)
