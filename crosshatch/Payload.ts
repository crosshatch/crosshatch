import { Context, Effect, Equal, Schema as S } from "effect"

import { JsonRecord } from "./_util.ts"
import { Payer } from "./Payer.ts"
import type { Required } from "./Required.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export interface Payload {
  readonly x402Version: typeof Version.Type
  readonly accepted: Requirements
  readonly extensions?: JsonRecord | undefined
  readonly payload: Record<string, unknown>
  readonly resource?: ResourceInfo | undefined
}

export const Payload = Object.assign(
  Context.Service<Payload, Payload | undefined>("crosshatch/Payload"),
  S.Struct({
    x402Version: Version,
    accepted: Requirements,
    extensions: JsonRecord.pipe(S.optional),
    payload: S.Record(S.String, S.Unknown),
    resource: ResourceInfo.pipe(S.optional),
  }),
)

export type Acceptable = typeof Acceptable.Type
export const Acceptable = Payload.pipe(S.brand("crosshatch/Acceptable"))

export const PayloadFromBase64JsonString = S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Payload))))

export const make = Effect.fnUntraced(function* ({ required }: { readonly required: Required }) {
  const { createPayload } = yield* Payer
  return yield* createPayload({ required })
})

export const isAcceptable = (
  accepts: ReadonlyArray<Requirements>,
  payload: Payload | undefined,
): payload is Acceptable =>
  payload !== undefined && accepts.some((requirement) => Equal.equals(requirement, payload.accepted))
