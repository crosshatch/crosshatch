import { Schema as S } from "effect"

import { ExtensionsEnvelope } from "./ExtensionsEnvelope.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export class Payload extends S.Class<Payload>("Payload")({
  x402Version: Version,
  accepted: Requirements,
  extensions: ExtensionsEnvelope.pipe(S.optional),
  payload: S.JsonObject,
  resource: ResourceInfo.pipe(S.optional),
}) {}
