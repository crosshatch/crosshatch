import { UnknownRecord } from "@crosshatch/util/schema"
import { Schema as S } from "effect"

import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"

export const Payload = S.Struct({
  accepted: Requirements,
  extensions: UnknownRecord.pipe(S.optional),
  payload: UnknownRecord,
  resource: ResourceInfo,
  x402Version: S.Number,
})
