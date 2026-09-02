import { type Layer, type Scope, Data, type Context, type Schema as S, type Effect } from "effect"

import type * as Namespace from "./Namespace.ts"
import type * as Requirements from "./Requirements.ts"

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause?: unknown }> {}

export type AdaptEffect<R> = Effect.Effect<S.JsonObject, CreatePayloadError, R>

export type Adapt<Extra, R> = (config: {
  readonly extra: Extra
  readonly accepted: Requirements.Requirements
}) => AdaptEffect<R>

const TypeId = "~crosshatch/Scheme" as const

export interface Scheme<
  Self,
  Id extends string,
  Namespace_ extends Namespace.NamespaceShape.Any,
  Extra,
> extends Context.Service<Self, Adapt<Extra, never>> {
  new (_: never): Context.ServiceClass.Shape<Id, Adapt<Extra, never>>

  readonly [TypeId]: typeof TypeId

  readonly namespace: Namespace_

  readonly make: (extra: Extra) => SchemeEnvelope

  readonly layer: <X extends S.Top & { readonly Type: Extra }, R>(
    Extra: X,
    f: Adapt<Extra, R>,
  ) => Layer.Layer<Self, never, Exclude<X["DecodingServices"] | R, Scope.Scope>>
}

export type Any = Scheme<any, string, Namespace.NamespaceShape.Any, any>

export interface SchemeEnvelope {
  readonly scheme: Any
  readonly extra: S.Top
}

export declare const Adapt: <Namespace_ extends Namespace.NamespaceShape.Any, Self, Extra>() => <Id extends string>(
  id: Id,
) => Scheme<Self, Id, Namespace_, Extra>
