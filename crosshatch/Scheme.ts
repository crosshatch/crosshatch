import { type Layer, type Scope, type Context, type Schema as S } from "effect"

import * as Proto from "./_Proto.ts"
import type { Adapt } from "./Adapt.ts"
import type * as Namespace from "./Namespace.ts"

const TypeId = Proto.id("Scheme")

export interface Scheme<Self, Id extends string, Namespace_ extends Namespace.Any, Extra> extends Context.Service<
  Self,
  Adapt<Extra, never>
> {
  new (_: never): Context.ServiceClass.Shape<Id, Adapt<Extra, never>>

  readonly [TypeId]: typeof TypeId

  readonly namespace: Namespace_

  readonly make: (extra: Extra) => SchemeEnvelope

  readonly layer: <X extends S.Top & { readonly Type: Extra }, R>(
    Extra: X,
    f: Adapt<Extra, R>,
  ) => Layer.Layer<Self, never, Exclude<X["DecodingServices"] | R, Scope.Scope>>
}

export type Any = Scheme<any, string, Namespace.Any, any>

export interface SchemeEnvelope {
  readonly scheme: Any
  readonly extra: S.Top
}

export const Service =
  <Namespace_ extends Namespace.Any, Self, Extra>() =>
  <Id extends string>(_id: Id): Scheme<Self, Id, Namespace_, Extra> =>
    null!
