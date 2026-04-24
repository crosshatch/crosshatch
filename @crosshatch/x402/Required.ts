import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Accepts = S.NonEmptyArray(Requirements)

export const Required = S.Struct({
  accepts: Accepts,
  error: S.String.pipe(S.optional),
  extensions: UnknownRecord.pipe(S.optional),
  resource: ResourceInfo,
  x402Version: Version,
})
