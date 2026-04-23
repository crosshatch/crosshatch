import { Schema as S, SchemaTransformation } from "effect"

import { brander } from "./_common.ts"

const brand = brander(2)

/** CAIP-2 namespace (e.g. `eip155`, `cosmos`, `bip122`). */
export const Namespace = S.String.check(S.isPattern(/^[-a-z0-9]{3,8}$/)).pipe(brand("Namespace"))

/** CAIP-2 reference — identifies a chain within a namespace. */
export const Reference = S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/)).pipe(brand("Reference"))

/** Encoded CAIP-2 chain id — `namespace:reference`. */
export const ChainIdString = S.TemplateLiteral([Namespace, ":", Reference]).pipe(brand("ChainIdString"))

/** Parsed CAIP-2 chain id. */
export const ChainIdParts = S.Struct({
  namespace: Namespace,
  reference: Reference,
})

/** CAIP-2 chain id codec: `namespace:reference` ↔ `{ namespace, reference }`. */
export const ChainId = ChainIdString.pipe(
  S.decodeTo(
    ChainIdParts,
    SchemaTransformation.transform({
      decode: (raw) => {
        const i = raw.indexOf(":")
        return { namespace: raw.slice(0, i), reference: raw.slice(i + 1) }
      },
      encode: (parts) => ChainIdString.make(`${parts.namespace}:${parts.reference}`),
    }),
  ),
)
