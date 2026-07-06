import { Schema as S } from "effect"

import { PrerequisitesUnmetError } from "./Prerequisite.ts"

export const BrowserProposeError = S.Union([PrerequisitesUnmetError])
