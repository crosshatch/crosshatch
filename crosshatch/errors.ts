import { Schema as S } from "effect"

import { Prerequisites } from "./Prerequisite.ts"

export class NoSuchSupportedAssetError extends S.TaggedErrorClass<NoSuchSupportedAssetError>()(
  "NoSuchSupportedAssetError",
  {},
) {}

export class PrerequisitesUnmetError extends S.TaggedErrorClass<PrerequisitesUnmetError>()("PrerequisitesUnmetError", {
  prerequisites: Prerequisites,
}) {}

export const ProposeError = S.Union([NoSuchSupportedAssetError, PrerequisitesUnmetError])
