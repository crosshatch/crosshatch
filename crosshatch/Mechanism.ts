import type { Context, Schema as S, Effect, Scope, Layer } from "effect"

import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("Mechanism")

export type MakePayload<Extra, A extends S.JsonObject, R> = (extra: Extra) => Effect.Effect<A, never, R>

export type Service<Extra extends S.JsonObject, A extends S.JsonObject, R> = {
  readonly makePayload: MakePayload<Extra, A, R>
}

export interface Mechanism<
  Self,
  Id extends string,
  Extra extends S.JsonObject,
  A extends S.JsonObject,
> extends Context.Service<Self, Service<Extra, A, never>> {
  new (_: never): Context.ServiceClass.Shape<Id, Service<Extra, A, never>>

  readonly [TypeId]: typeof TypeId

  readonly extra: Extra
}

export type Any = Mechanism<any, string, any, S.JsonObject>

export type Extra<Mechanism_ extends Any> =
  Mechanism_ extends Mechanism<any, string, infer Extra_, S.JsonObject> ? Extra_ : never

export declare const Service: <Self, Extra extends S.JsonObject, A extends S.JsonObject>() => <
  Identifier extends string,
>(
  identifier: Identifier,
) => Mechanism<Self, Identifier, Extra, A>

export declare const layer: <Self, Id extends string, Extra extends S.JsonObject, A extends S.JsonObject, R>(
  mechanism: Mechanism<Self, Id, Extra, A>,
  f: MakePayload<Extra, A, R>,
) => Layer.Layer<Self, never, Exclude<R, Scope.Scope>>
