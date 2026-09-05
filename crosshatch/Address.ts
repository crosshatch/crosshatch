import { Schema as S, type Pipeable, Config, Effect, Predicate, SchemaGetter, type Brand } from "effect"

import { instance } from "./_instance.ts"
import * as Proto from "./_Proto.ts"
import type * as Namespace from "./Namespace.ts"

const TypeId = Proto.id("Address")

export type AddressString = typeof AddressString.Type
export const AddressString = S.String.check(S.isPattern(/^[-.%a-zA-Z0-9]{1,128}$/u)).pipe(S.brand(TypeId))

export interface Address<Namespace_ extends Namespace.Any> extends Pipeable.Pipeable {
  readonly [TypeId]: typeof TypeId

  readonly namespace: Namespace_

  readonly raw: Brand.Branded<AddressString, Namespace_["id"]>
}

export const isAddress = (v: unknown): v is Address<Namespace.Any> => Predicate.hasProperty(v, TypeId)

export const make = <Namespace_ extends Namespace.Any = Namespace.Any>(
  address: string,
  namespaceClass?: new () => Namespace_,
): Effect.Effect<Address<Namespace_>, S.SchemaError> => {
  const namespace = namespaceClass ? instance(namespaceClass) : null!
  return S.decodeEffect(namespace ? namespace.AddressString : AddressString)(address).pipe(
    Effect.map((v) => ({
      ...Proto.make(TypeId),
      namespace,
      raw: v as never,
    })),
  )
}

export const AddressFromString = AddressString.pipe(
  S.decodeTo(S.declare(isAddress), {
    decode: SchemaGetter.transformOrFail((v) => make(v).pipe(Effect.mapError((v) => v.issue))),
    encode: SchemaGetter.transform((v) => v.raw),
  }),
)

export const fromConfig = <Namespace_ extends Namespace.Any>(
  namespaceClass: new () => Namespace_,
  name?: string,
): Config.Config<Address<Namespace_>> =>
  Config.string(name).pipe(
    Config.mapOrFail((v) => make(v, namespaceClass).pipe(Effect.mapError((cause) => new Config.ConfigError(cause)))),
  )
