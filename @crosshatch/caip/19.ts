import { Schema as S, SchemaTransformation } from "effect"

import * as Caip2 from "./2.ts"
import { brander } from "./_common.ts"

const brand = brander(19)

/** CAIP-19 asset namespace (e.g. `slip44`, `erc20`, `erc721`). */
export const AssetNamespace = S.String.check(S.isPattern(/^[-a-z0-9]{3,8}$/)).pipe(brand("AssetNamespace"))

/** CAIP-19 asset reference — identifies an asset within a namespace. */
export const AssetReference = S.String.check(S.isPattern(/^[-.%a-zA-Z0-9]{1,128}$/)).pipe(brand("AssetReference"))

/** CAIP-19 token id — addresses an individual token within a non-fungible collection. */
export const TokenId = S.String.check(S.isPattern(/^[-.%a-zA-Z0-9]{1,78}$/)).pipe(brand("TokenId"))

/** Encoded CAIP-19 asset type — `namespace:reference/asset_namespace:asset_reference`. */
export const AssetTypeString = S.TemplateLiteral([Caip2.ChainIdString, "/", AssetNamespace, ":", AssetReference]).pipe(
  brand("AssetTypeString"),
)

/** Parsed CAIP-19 asset type. */
export const AssetTypeParts = S.Struct({
  chainId: Caip2.ChainIdParts,
  assetNamespace: AssetNamespace,
  assetReference: AssetReference,
})

/** CAIP-19 asset type codec: `chain_id/asset_namespace:asset_reference` ↔ `{ chainId, assetNamespace, assetReference }`. */
export const AssetType = AssetTypeString.pipe(
  S.decodeTo(
    AssetTypeParts,
    SchemaTransformation.transform({
      decode: (raw) => {
        const slash = raw.indexOf("/")
        const chainIdRaw = raw.slice(0, slash)
        const assetRaw = raw.slice(slash + 1)
        const chainColon = chainIdRaw.indexOf(":")
        const assetColon = assetRaw.indexOf(":")
        return {
          chainId: {
            namespace: chainIdRaw.slice(0, chainColon),
            reference: chainIdRaw.slice(chainColon + 1),
          },
          assetNamespace: assetRaw.slice(0, assetColon),
          assetReference: assetRaw.slice(assetColon + 1),
        }
      },
      encode: (parts) =>
        AssetTypeString.make(
          `${parts.chainId.namespace}:${parts.chainId.reference}/${parts.assetNamespace}:${parts.assetReference}`,
        ),
    }),
  ),
)

/** Encoded CAIP-19 asset id — `asset_type/token_id`. */
export const AssetIdString = S.TemplateLiteral([AssetTypeString, "/", TokenId]).pipe(brand("AssetIdString"))

/** Parsed CAIP-19 asset id. */
export const AssetIdParts = S.Struct({
  assetType: AssetTypeParts,
  tokenId: TokenId,
})

/** CAIP-19 asset id codec: `chain_id/asset_namespace:asset_reference/token_id` ↔ `{ assetType, tokenId }`. */
export const AssetId = AssetIdString.pipe(
  S.decodeTo(
    AssetIdParts,
    SchemaTransformation.transform({
      decode: (raw) => {
        const lastSlash = raw.lastIndexOf("/")
        const assetTypeRaw = raw.slice(0, lastSlash)
        const tokenId = raw.slice(lastSlash + 1)
        const firstSlash = assetTypeRaw.indexOf("/")
        const chainIdRaw = assetTypeRaw.slice(0, firstSlash)
        const assetRaw = assetTypeRaw.slice(firstSlash + 1)
        const chainColon = chainIdRaw.indexOf(":")
        const assetColon = assetRaw.indexOf(":")
        return {
          assetType: {
            chainId: {
              namespace: chainIdRaw.slice(0, chainColon),
              reference: chainIdRaw.slice(chainColon + 1),
            },
            assetNamespace: assetRaw.slice(0, assetColon),
            assetReference: assetRaw.slice(assetColon + 1),
          },
          tokenId,
        }
      },
      encode: (parts) =>
        AssetIdString.make(
          `${parts.assetType.chainId.namespace}:${parts.assetType.chainId.reference}/${parts.assetType.assetNamespace}:${parts.assetType.assetReference}/${parts.tokenId}`,
        ),
    }),
  ),
)
