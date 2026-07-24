import { Context, Effect, Equal, Schema as S } from "effect"

import { Base64JsonString, JsonRecord } from "./_util.ts"
import { Payer } from "./Payer.ts"
import type { Required } from "./Required.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

type Payload_ = typeof Payload_.Type
const Payload_ = S.Struct({
  x402Version: Version,
  accepted: Requirements,
  extensions: JsonRecord.pipe(S.optional),
  payload: S.Record(S.String, S.Unknown),
  resource: ResourceInfo.pipe(S.optional),
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface Payload extends Payload_ {}

export const Payload = Object.assign(Context.Service<Payload, Payload | undefined>("crosshatch/Payload"), Payload_)

export type Acceptable = typeof Acceptable.Type
export const Acceptable = Payload.pipe(S.brand("crosshatch/Acceptable"))

export const PayloadFromBase64JsonString = Base64JsonString(Payload)

export const make = ({ required }: { readonly required: Required }) =>
  Effect.flatMap(Payer, ({ createPayload }) => createPayload({ required }))

export const isAcceptable = (
  accepts: ReadonlyArray<Requirements>,
  payload: Payload | undefined,
): payload is Acceptable =>
  payload !== undefined && accepts.some((requirement) => Equal.equals(requirement, payload.accepted))
