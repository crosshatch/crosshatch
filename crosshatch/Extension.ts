import { JsonRecord } from "@crosshatch/util"
import { Schema as S, Context, Layer, Effect, type Scope, flow } from "effect"

import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"
import type { Requirements } from "./Requirements.ts"
import type { SchemePayload } from "./Scheme.ts"

const TypeId = "~crosshatch/Extension" as const

export type Envelope = typeof Envelope.Type
export const Envelope = S.Struct({
  info: JsonRecord,
  schema: JsonRecord,
})

export type Envelopes = typeof Envelopes.Type
export const Envelopes = S.Record(S.String, Envelope)

export type Service<Enrichment extends S.Top> = Enrichment["Type"] | undefined

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

  readonly schema: JsonRecord

  readonly decodeRequired: (required: Required) => Effect.Effect<Info["Type"], S.SchemaError, Info["DecodingServices"]>

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

const envelopeInfo = (extensions: Envelopes | undefined, identifier: string) => extensions?.[identifier]?.info

export const encodeJsonRecord = <A extends S.Top>(schema: A) =>
  Effect.fnUntraced(function* (value: A["Type"]) {
    const json = yield* S.encodeEffect(S.toCodecJson(schema))(value)
    return yield* S.decodeUnknownEffect(JsonRecord)(json)
  })

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
      readonly schema: JsonRecord
    },
  ): Extension<Self, Id, Identifier, Info, Enrichment> => {
    const tag = Context.Service<Self, Service<Enrichment>>()(id)
    const { identifier, info, enrichment } = definition

    const decodeRequired = (required: Required) =>
      S.decodeUnknownEffect(S.toCodecJson(info))(envelopeInfo(required.extensions, identifier))

    const decodePayload = (payload: Payload) =>
      S.decodeUnknownEffect(S.toCodecJson(enrichment))(envelopeInfo(payload.extensions, identifier))

    return Object.assign(tag, {
      [TypeId]: TypeId,
      ...definition,
      decodeRequired,
      decodePayload,
    })
  }

export const layerFromPayload = <
  Self,
  Id extends string,
  Identifier extends string,
  Info extends Extension.Info,
  Enrichment extends Extension.Enrichment<Info>,
>(
  extension: Extension<Self, Id, Identifier, Info, Enrichment>,
  payload: Payload | undefined,
): Layer.Layer<Self, S.SchemaError, Exclude<Enrichment["DecodingServices"], Scope.Scope>> =>
  Layer.effect(
    extension,
    Effect.gen(function* () {
      const info = envelopeInfo(payload?.extensions, extension.identifier)
      if (info) {
        return yield* S.decodeEffect(S.toCodecJson(extension.enrichment))(info)
      }
      return
    }),
  )

export interface ExtensionHandlerConfig<Info extends S.Top> {
  readonly info: Info["Type"]
  readonly payload: SchemePayload
  readonly accepted: Requirements
  readonly required: Required
}

export class ExtensionRegistry extends Context.Reference<
  Map<Extension.Any, (payload: ExtensionHandlerConfig<any>) => Effect.Effect<unknown>>
>("crosshatch/ExtensionRegistry", {
  defaultValue: () => new Map(),
}) {}

export const layerHandler = Effect.fnUntraced(function* <
  Self,
  Id extends string,
  Identifier extends string,
  Info extends Extension.Info,
  Enrichment extends Extension.Enrichment<Info>,
  R,
>(
  extension: Extension<Self, Id, Identifier, Info, Enrichment>,
  f: (payload: ExtensionHandlerConfig<Info>) => Effect.Effect<Enrichment["Type"], never, R>,
) {
  const registry = yield* ExtensionRegistry
  const context = yield* Effect.context<R>()
  registry.set(extension, flow(f, Effect.provide(Layer.succeedContext(context)), Effect.scoped))
  return Layer.empty
}, Layer.unwrap)
