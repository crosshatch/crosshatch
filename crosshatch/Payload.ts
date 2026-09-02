import { Context, Schema as S } from "effect"

import * as Extension from "./Extension.ts"
import * as Requirements from "./Requirements.ts"
import * as ResourceInfo from "./ResourceInfo.ts"

type Payload_ = typeof Payload_.Type
const Payload_ = S.Struct({
  x402Version: S.Literal(2),
  accepted: Requirements.Requirements,
  extensions: Extension.ExtensionsEnvelope.pipe(S.optional),
  payload: S.JsonObject,
  resource: ResourceInfo.ResourceInfo.pipe(S.optional),
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface Payload extends Payload_ {}

export const Payload = Object.assign(Context.Service<Payload, Payload | undefined>("crosshatch/Payload"), Payload_)

export const PayloadJson = S.toCodecJson(Payload)
export const PayloadFromJsonString = S.fromJsonString(PayloadJson)
export const PayloadFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(PayloadFromJsonString))
