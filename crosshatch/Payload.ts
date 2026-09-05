import { Context, Equal, Schema as S, Option, Effect, Layer, type Pipeable, Predicate, SchemaGetter } from "effect"
import { HttpServerRequest, Headers } from "effect/unstable/http"

import { PAYMENT_SIGNATURE } from "./_constants.ts"
import * as Proto from "./_Proto.ts"
import type { Accepts } from "./Accepts.ts"
import { ExtensionsEnvelope } from "./Extension.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

const TypeId = Proto.id("Payload")

export type PayloadFields = typeof PayloadFields.Type
export const PayloadFields = S.Struct({
  x402Version: Version,
  accepted: Requirements,
  extensions: ExtensionsEnvelope.pipe(S.optional),
  payload: S.JsonObject,
  resource: ResourceInfo.pipe(S.optional),
})

export interface Payload extends PayloadFields, Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId
}

export const isPayload = (v: unknown): v is Payload => Predicate.hasProperty(v, TypeId)

export const make = (v: PayloadFields): Payload => ({ ...Proto.make(TypeId), ...v })

export const Payload = Object.assign(
  Context.Service<Payload, Payload | undefined>("crosshatch/Payload"),
  PayloadFields.pipe(
    S.decodeTo(S.declare(isPayload), {
      decode: SchemaGetter.transform(make),
      encode: SchemaGetter.transform(({ x402Version, accepted, extensions, payload, resource }) => ({
        x402Version,
        accepted,
        extensions,
        payload,
        resource,
      })),
    }),
  ),
)

export const PayloadFromString = S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Payload))))

export const match = (payload: unknown, accepts: Accepts): payload is Payload =>
  isPayload(payload) ? accepts.raw.some(Equal.equals(payload.accepted)) : false

export const layerFromRequest = Layer.effect(
  Payload,
  Effect.gen(function* () {
    const { headers } = yield* HttpServerRequest.HttpServerRequest
    return Headers.get(PAYMENT_SIGNATURE)(headers).pipe(
      Option.flatMap(S.decodeUnknownOption(PayloadFromString)),
      Option.getOrUndefined,
    )
  }),
)
