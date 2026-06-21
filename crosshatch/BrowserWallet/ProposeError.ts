import { Schema as S } from "effect"

import { CaPaymentPayloadMakeError } from "../Ca/Ca.ts"
import { NoSuchSupportedAssetError } from "../errors.ts"
import { PrerequisitesUnmetError } from "./Prerequisite.ts"

export const ProposeError = S.Union([NoSuchSupportedAssetError, PrerequisitesUnmetError, CaPaymentPayloadMakeError])
