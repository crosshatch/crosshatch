import { Schema as S } from "effect"

export class NoSuchSupportedAssetError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  {},
) {}
