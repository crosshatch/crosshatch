import { Schema as S } from "effect"

import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Payload = S.Struct({
  x402Version: Version,
  accepted: Requirements,
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  payload: S.Record(S.String, S.Unknown),
  resource: ResourceInfo.pipe(S.optional),
})
