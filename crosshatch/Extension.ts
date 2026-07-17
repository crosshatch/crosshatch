import { Schema as S, Context, Layer, Effect, Scope, flow, Cause } from "effect"

import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"
import type { SchemePayload } from "./Scheme.ts"

const TypeId = "~crosshatch/Extension" as const

export type Service<Success extends S.Top> = Success["Type"] | undefined

export const ExtensionsInfo = S.Record(S.String, S.Json)

export interface Extension<
  Self,
  Id extends string,
  Identifier extends string,
  Info extends Extension.Info,
  Enrichment extends Extension.Enrichment<Info>,
> extends Context.Service<Self, Service<Enrichment>> {
  new (_: never): Context.ServiceClass.Shape<Id, Service<Enrichment>>

  readonly [TypeId]: typeof TypeId

  readonly identifier: Identifier

  readonly info: Info

  readonly enrichment: Enrichment

  readonly layer: ({
    payload,
  }: {
    readonly payload: Payload | undefined
  }) => Layer.Layer<Self, S.SchemaError, Exclude<Enrichment["DecodingServices"], Scope.Scope>>

  readonly ensure: Effect.Effect<Enrichment["Type"], Cause.NoSuchElementError, Self>

  readonly decodeRequired: (
    required: typeof Required.Type,
  ) => Effect.Effect<Info["Type"], S.SchemaError, Info["DecodingServices"]>

  readonly decodePayload: (
    payload: Payload,
  ) => Effect.Effect<Enrichment["Type"], S.SchemaError, Enrichment["DecodingServices"]>
}

export declare namespace Extension {
  export type Info = S.Top & { readonly DecodingServices: never }

  export type Enrichment<T extends S.Top> = S.Top & {
    readonly Type: T["Type"]
    readonly EncodingServices: never
  }

  export type Any = Extension<any, string, string, Info, Enrichment<Info>>
}

export const Service =
  <Self>() =>
  <
    Id extends string,
    Identifier extends string,
    Info extends Extension.Info,
    Enrichment extends Extension.Enrichment<Info>,
  >(
    id: Id,
    definition: {
      readonly identifier: Identifier
      readonly info: Info
      readonly enrichment: Enrichment
    },
  ): Extension<Self, Id, Identifier, Info, Enrichment> => {
    const tag = Context.Service<Self, Service<Enrichment>>()(id)
    const { identifier, info, enrichment } = definition

    const layer = ({ payload }: { readonly payload: Payload | undefined }) =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const entry = payload?.extensions?.[identifier]
          if (entry) {
            return yield* S.decodeUnknownEffect(S.toCodecJson(enrichment))(entry)
          }
          return
        }),
      )

    const ensure = Effect.flatMap(tag, Effect.fromNullishOr)

    const decodeRequired = (required: typeof Required.Type) =>
      S.decodeUnknownEffect(S.toCodecJson(info))(required.extensions?.[identifier])

    const decodePayload = (required: Payload) =>
      S.decodeUnknownEffect(S.toCodecJson(enrichment))(required.extensions?.[identifier])

    return Object.assign(tag, {
      [TypeId]: TypeId,
      ...definition,
      layer,
      ensure,
      decodeRequired,
      decodePayload,
    })
  }

export interface ExtensionHandlerConfig<Info extends S.Top> {
  readonly info: Info["Type"]
  readonly payload: SchemePayload
  readonly accepted: Requirements
  readonly required: typeof Required.Type
}

export class ExtensionRegistry extends Context.Reference<
  Map<Extension.Any, (payload: ExtensionHandlerConfig<any>) => Effect.Effect<unknown, never, never>>
>("crosshatch/ExtensionRegistry", {
  defaultValue: () => new Map(),
}) {}

export const layerHandler = Effect.fnUntraced(function* <
  Self,
  Id extends string,
  Identifier extends string,
  Info extends Extension.Info,
  Success extends Extension.Enrichment<Info>,
  R,
>(
  extension: Extension<Self, Id, Identifier, Info, Success>,
  f: (payload: ExtensionHandlerConfig<Info>) => Effect.Effect<Success["Type"], never, R>,
) {
  const registry = yield* ExtensionRegistry
  const context = yield* Effect.context<R>()
  registry.set(extension, flow(f, Effect.provide(Layer.succeedContext(context)), Effect.scoped))
  return Layer.empty
}, Layer.unwrap)
