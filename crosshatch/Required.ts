import { Schema as S } from "effect"

import { AcceptsFromRequirementsArray } from "./Accepts.ts"
import { ExtensionsEnvelope } from "./ExtensionsEnvelope.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export class Required extends S.Class<Required>("Required")({
  x402Version: Version,
  resource: ResourceInfo,
  accepts: AcceptsFromRequirementsArray,
  error: S.String.pipe(S.optional),
  extensions: ExtensionsEnvelope.pipe(S.optional),
}) {}
