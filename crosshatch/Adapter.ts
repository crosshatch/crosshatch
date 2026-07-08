import { Context, Effect, Layer, Option, Schema as S, Scope } from "effect"

import type { CreatePayloadError } from "./Payer.ts"
import type { Requirements } from "./Requirements.ts"

export type Match<Extras, R> = (
  requirements: typeof Requirements.Type,
) => Effect.Effect<Option.Option<Extras>, never, R>

export type Make<Extras, R2> = (extras: Extras) => Effect.Effect<Record<string, unknown>, CreatePayloadError, R2>

export interface Service {
  readonly match: Match<unknown, never>
  readonly make: Make<any, never>
}

const TypeId = "~crosshatch/PayloadAdapter" as const

export interface PayloadAdapter<Self, Id extends string> extends Context.Service<Self, Service> {
  new (_: never): Context.ServiceClass.Shape<Id, Service>

  readonly [TypeId]: typeof TypeId

  readonly layer: <Extras, R, R2>(
    match: Match<Extras, R>,
    make: Make<Extras, R2>,
  ) => Layer.Layer<Self, S.SchemaError, Exclude<R | R2, Scope.Scope>>
}

export class AdapterRegistry extends Context.Reference<Map<Context.ServiceClass<any, any, Service>, Service>>(
  "crosshatch/AdapterRegistry",
  { defaultValue: () => new Map() },
) {}

export const Service =
  <Self>() =>
  <Id extends string>(id: Id): PayloadAdapter<Self, Id> => {
    const tag = Context.Service<Self, Service>()(id)
    const layer = <Extras, R, R2>(
      match: Match<Extras, R>,
      make: Make<Extras, R2>,
    ): Layer.Layer<Self, S.SchemaError, Exclude<R | R2, Scope.Scope>> =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const registry = yield* AdapterRegistry
          const adapter = { match, make } as never
          registry.set(tag, adapter)
          return adapter
        }),
      )
    return Object.assign(tag, {
      [TypeId]: TypeId,
      layer,
    })
  }
