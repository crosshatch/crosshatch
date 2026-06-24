import { Schema as S } from "effect"

import { NoSuchSupportedAssetError } from "../errors.ts"
import { PrerequisitesUnmetError } from "./Prerequisite.ts"

export const ProposeError = S.Union([NoSuchSupportedAssetError, PrerequisitesUnmetError])
