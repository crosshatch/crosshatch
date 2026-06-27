import { Effect, Schema as S } from "effect"

import { Payer } from "./Payer.ts"
import type { Required } from "./Required.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { TraceId } from "./traced.ts"
import { Version } from "./Version.ts"

export const Payload = S.Struct({
  x402Version: Version,
  accepted: Requirements,
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  payload: S.Record(S.String, S.Unknown),
  resource: ResourceInfo.pipe(S.optional),
})

export const make = Effect.fnUntraced(function* (required: typeof Required.Type, traceId_?: string) {
  const { createTrace, createPayload } = yield* Payer
  const traceId = traceId_ ?? (yield* createTrace ? TraceId : Effect.undefined)
  return yield* createPayload({ required, traceId })
})
