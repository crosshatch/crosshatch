import { Schema as S } from "effect"

import { Asset, ChainId } from "./Ca/Ca.ts"

export class NoSuchSupportedAssetError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  {
    notFound: S.Array(
      S.Struct({
        chainId: ChainId.ChainId,
        asset: Asset.Asset,
      }),
    ),
  },
) {}

export class NoSuchSupportedMethodError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  { method: S.String },
) {}
