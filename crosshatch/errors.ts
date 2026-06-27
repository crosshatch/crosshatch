import { Data, Schema as S } from "effect"

import { Asset } from "./Asset.ts"
import { ChainId } from "./ChainId.ts"

export class NoSuchSupportedAssetError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  {
    notFound: S.Array(
      S.Struct({
        chainId: ChainId,
        asset: Asset,
      }),
    ),
  },
) {}

export class NoSuchSupportedMethodError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  { method: S.String },
) {}

// TODO: schema-ify
export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause?: unknown }> {}

// TODO: schema-ify
export class CreateTraceError extends Data.TaggedError("CreateTraceError")<{ readonly cause: unknown }> {}

export class RequirementSelectionError extends S.TaggedErrorClass<RequirementSelectionError>()(
  "RequirementSelectionError",
  {},
) {}
