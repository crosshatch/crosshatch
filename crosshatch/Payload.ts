import { Schema as S } from "effect"

import * as Accepts from "./Accepts.ts"
import { ExtensionsEnvelope } from "./ExtensionsEnvelope.ts"
import * as Requirements from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export class Payload extends S.Class<Payload>("Payload")({
  x402Version: Version,
  accepted: Requirements.Requirements,
  extensions: ExtensionsEnvelope.pipe(S.optional),
  payload: S.JsonObject,
  resource: ResourceInfo.pipe(S.optional),
}) {}

export const isAcceptable = (payload: Payload, accepts: Accepts.Accepts): boolean =>
  Accepts.isAcceptable(accepts, payload.accepted)
