import { Data, Context, type Schema as S, type Effect } from "effect"

import * as Proto from "./_Proto.ts"
import * as MechanismConfig from "./MechanismConfig.ts"
import type { Requirements } from "./Requirements.ts"

const TypeId = Proto.id("Mechanism")

export class MakePayloadError extends Data.TaggedError("MakePayloadError")<{ readonly cause: unknown }> {}

export type ExtraSchema = S.Top & { readonly Encoded: S.JsonObject }

export type MakePayload<ExtraSchema_ extends ExtraSchema, A extends S.JsonObject, R> = (input: {
  readonly accepted: Requirements
  readonly extra: ExtraSchema_["Type"]
}) => Effect.Effect<A, MakePayloadError, R>

export interface Mechanism<
  Self,
  Id extends string,
  ExtraSchema_ extends ExtraSchema,
  A extends S.JsonObject,
> extends Context.Service<Self, MakePayload<ExtraSchema_, A, never>> {
  new (_: never): Context.ServiceClass.Shape<Id, MakePayload<ExtraSchema_, A, never>>

  readonly [TypeId]: typeof TypeId

  readonly extraSchema: ExtraSchema_

  make<T extends Mechanism<Self, Id, ExtraSchema_, A>>(
    this: T,
    extra: ExtraSchema_["Type"],
  ): MechanismConfig.MechanismConfig<T>
}

export type Any = Mechanism<any, string, any, S.JsonObject>

export type Extra<Mechanism_ extends Any> =
  Mechanism_ extends Mechanism<any, string, infer ExtraSchema_, S.JsonObject> ? ExtraSchema_["Type"] : never

export const Service =
  <Self, A extends S.JsonObject>() =>
  <Identifier extends string, ExtraSchema_ extends ExtraSchema>(
    identifier: Identifier,
    extraSchema: ExtraSchema_,
  ): Mechanism<Self, Identifier, ExtraSchema_, A> => {
    const Service = Context.Service<Self, MakePayload<ExtraSchema_, A, never>>()(identifier)
    function make<T extends Mechanism<Self, Identifier, ExtraSchema_, A>>(this: T, extra: Extra<T>) {
      return MechanismConfig.make(this, extra)
    }
    return Object.assign(Service, { [TypeId]: TypeId, extraSchema, make })
  }

export const layerClient = <Self, Id extends string, ExtraSchema_ extends ExtraSchema, A extends S.JsonObject, R>(
  _mechanism: Mechanism<Self, Id, ExtraSchema_, A>,
  f: MakePayload<ExtraSchema_, A, R>,
) => f
