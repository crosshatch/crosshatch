import { Data, type Context, type Schema as S, type Effect, type Scope, type Layer } from "effect"

import * as Proto from "./_Proto.ts"
import type { MechanismConfig } from "./MechanismConfig.ts"
import type { Requirements } from "./Requirements.ts"

const TypeId = Proto.id("Mechanism")

export class MakePayloadError extends Data.TaggedError("MakePayloadError")<{ readonly cause: unknown }> {}

export type MakePayload<Extra, A extends S.JsonObject, R> = (
  accepted: Requirements,
  extra: Extra,
) => Effect.Effect<A, MakePayloadError, R>

export interface Mechanism<
  Self,
  Id extends string,
  Extra extends S.JsonObject,
  A extends S.JsonObject,
> extends Context.Service<Self, MakePayload<Extra, A, never>> {
  new (_: never): Context.ServiceClass.Shape<Id, MakePayload<Extra, A, never>>

  readonly [TypeId]: typeof TypeId

  readonly make: <T extends Mechanism<Self, Id, Extra, A>>(this: T, extra: Extra) => MechanismConfig<T>
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
