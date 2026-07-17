import { Context, Data, Effect, flow, Layer, Schema as S, Scope } from "effect"

import type { PhysicalAsset } from "./Asset.ts"
import type { Requirements } from "./Requirements.ts"

export type SchemePayload = Record<string, S.Json>

export class CreatePayloadError extends Data.TaggedError("CreatePayloadError")<{ readonly cause?: unknown }> {}

export type Adapt<R> = Effect.Effect<SchemePayload, CreatePayloadError, R>

export interface SchemeConfig {
  readonly accepted: Requirements
  readonly physical: PhysicalAsset
}

export type Service = ({ accepted, physical }: SchemeConfig) => Effect.Effect<Adapt<never>, S.SchemaError>

const TypeId = "~crosshatch/Scheme" as const

export interface Scheme<Self, Id extends string, Known, Extra> extends Context.Service<Self, Service> {
  new (_: never): Context.ServiceClass.Shape<Id, Service>

  readonly [TypeId]: typeof TypeId

  readonly layer: <T extends S.Top & { readonly Type: Known }, T2 extends S.Top & { readonly Type: Extra }, R>(
    {
      known,
      extra,
    }: {
      readonly known: T
      readonly extra: T2
    },
    f: ({
      known,
      extra,
    }: {
      readonly known: T["Type"]
      readonly extra: T2["Type"]
    }) => (config: SchemeConfig) => Adapt<R>,
  ) => Layer.Layer<Self, never, Exclude<T2["DecodingServices"] | R, Scope.Scope>>
}

export declare namespace Scheme {
  export type Any = Scheme<any, any, any, any>
}

export const Service =
  <Self, Known, Extra>() =>
  <Id extends string>(id: Id): Scheme<Self, Id, Known, Extra> => {
    const tag = Context.Service<Self, Service>()(id)
    const layer = <T extends S.Top & { readonly Type: Known }, T2 extends S.Top & { readonly Type: Extra }, R>(
      {
        known,
        extra,
      }: {
        readonly known: T
        readonly extra: T2
      },
      f: ({
        known,
        extra,
      }: {
        readonly known: T["Type"]
        readonly extra: T2["Type"]
      }) => (config: SchemeConfig) => Adapt<R>,
    ): Layer.Layer<Self, never, Exclude<T2["DecodingServices"] | R, Scope.Scope>> =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const context = yield* Effect.context<Exclude<T2["DecodingServices"] | R, Scope.Scope>>()
          const bound = flow(Effect.scoped, Effect.provideContext(context))
          return Effect.fnUntraced(function* ({
            accepted,
            physical,
          }: {
            readonly accepted: Requirements
            readonly physical: PhysicalAsset
          }) {
            const match = yield* Effect.all(
              {
                known: S.decodeUnknownEffect(S.toType(known))(physical.metadata),
                extra: S.decodeUnknownEffect(extra)(accepted.extra),
              },
              { concurrency: "unbounded" },
            )
            return f(match)({ accepted, physical }).pipe(bound)
          }, bound)
        }),
      )
    return Object.assign(tag, { [TypeId]: TypeId, layer })
  }
