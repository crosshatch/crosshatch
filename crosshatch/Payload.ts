import { Effect, Schema as S } from "effect"

import { ExtensionsInfo } from "./Extension.ts"
import { Payer } from "./Payer.ts"
import type { Required } from "./Required.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Payload = S.Struct({
  x402Version: Version,
  accepted: Requirements,
  extensions: ExtensionsInfo.pipe(S.optional),
  payload: S.Record(S.String, S.Unknown),
  resource: ResourceInfo.pipe(S.optional),
})

export const PayloadFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Payload))))

export const make = Effect.fnUntraced(function* ({ required }: { readonly required: typeof Required.Type }) {
  const { createPayload } = yield* Payer
  return yield* createPayload({ required })
})
