import { Schema as S } from "effect"

import { Prerequisites } from "./Prerequisite.ts"

export class AssetNotSupportedError extends S.TaggedErrorClass<AssetNotSupportedError>()(
  "AssetNotSupportedError",
  {},
) {}

export class PrerequisitesUnmetError extends S.TaggedErrorClass<PrerequisitesUnmetError>()("PrerequisitesUnmetError", {
  prerequisites: Prerequisites,
}) {}

export const ProposeError = S.Union([AssetNotSupportedError, PrerequisitesUnmetError])
