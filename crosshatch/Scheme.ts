import { type Layer, type Scope, type Schema as S, Context } from "effect"

import * as Proto from "./_Proto.ts"
import type { Adapt } from "./Adapt.ts"
import type * as Namespace from "./Namespace.ts"

const TypeId = Proto.id("Scheme")

export interface Scheme<
  Self,
  Id extends string,
  Namespace_ extends Namespace.Any,
  Extra,
  A extends S.JsonObject,
> extends Context.Service<Self, Adapt<Extra, A, never>> {
  new (_: never): Context.ServiceClass.Shape<Id, Adapt<Extra, A, never>>

  readonly [TypeId]: typeof TypeId

  readonly namespace: Namespace_

  readonly make: (extra: Extra) => SchemeEnvelope

  readonly layer: <X extends S.Top & { readonly Type: Extra }, R>(
    Extra: X,
    f: Adapt<Extra, A, R>,
  ) => Layer.Layer<Self, never, Exclude<X["DecodingServices"] | R, Scope.Scope>>
}

export type Any = Scheme<any, string, Namespace.Any, any, S.JsonObject>

export interface SchemeEnvelope {
  readonly scheme: Any
  readonly extra: S.Top
}

export const Service =
  <Self, Namespace_ extends Namespace.Any, Extra, A extends S.JsonObject>() =>
  <Id extends string>(_id: Id): Scheme<Self, Id, Namespace_, Extra, A> => {
    // oxlint-disable-next-line effecttsgo/service-not-as-class
    const Context_ = Context.Service<Self, Adapt<Extra, A, never>>()
    return Object.assign(Context_, {}) as never
  }
