import { type Effect, type Pipeable, Predicate, Schema as S, SchemaGetter, Function } from "effect"

import * as Proto from "./_Proto.ts"
import { Accepts } from "./Accepts.ts"
import { ExtensionsEnvelope } from "./Extension.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

const TypeId = Proto.id("Required")

export type RequiredFields = typeof RequiredFields.Type
export const RequiredFields = S.Struct({
  x402Version: Version,
  resource: ResourceInfo,
  accepts: Accepts,
  error: S.String.pipe(S.optional),
  extensions: ExtensionsEnvelope.pipe(S.optional),
})

export interface Required extends RequiredFields, Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId
}

export const isRequired = (v: unknown): v is Required => Predicate.hasProperty(v, TypeId)

export const make = (v: RequiredFields): Required => ({ ...Proto.make(TypeId), ...v })

export const Required = RequiredFields.pipe(
  S.decodeTo(S.declare(isRequired), {
    decode: SchemaGetter.transform(make),
    encode: SchemaGetter.transform(({ x402Version, resource, accepts, error, extensions }) => ({
      x402Version,
      resource,
      accepts,
      error,
      extensions,
    })),
  }),
)

export const RequiredFromString = S.StringFromBase64.pipe(S.decodeTo(S.fromJsonString(S.toCodecJson(Required))))

export const describe = Function.dual<
  (
    e0: TemplateStringsArray | string,
    ...substitutions: ReadonlyArray<string | number>
  ) => (accepts: Accepts) => Effect.Effect<Required, S.SchemaError>,
  (
    accepts: Accepts,
    e0: TemplateStringsArray | string,
    ...substitutions: ReadonlyArray<string | number>
  ) => Effect.Effect<Required, S.SchemaError>
>(2, null!)
