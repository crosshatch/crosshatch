import { type Schema as S, Context } from "effect"

import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("Extension")

export type Service<Enrichment extends S.Top> = Enrichment["Type"] | undefined

export interface Extension<
  Self,
  Identifier extends string,
  K extends string,
  Info_ extends Info,
  Enrichment_ extends Enrichment<Info_>,
> extends Context.Service<Self, Service<Enrichment_>> {
  new (_: never): Context.ServiceClass.Shape<Identifier, Service<Enrichment_>>

  readonly [TypeId]: typeof TypeId

  readonly xKey: K

  readonly info: Info

  readonly enrichment: Enrichment_

  readonly make: (info: Info_["Type"]) => ExtensionPayload<K, Info_>
}

export type Info = S.Top & { readonly Encoded: S.Json }

export type Enrichment<T extends S.Top> = S.Top & { readonly Encoded: T["Encoded"] }

export type Any = Extension<any, string, string, Info, Enrichment<Info>>

export interface ExtensionPayload<K extends string, Info_ extends Info> {
  readonly xKey: K
  readonly infoSchema: Info_
  readonly info: Info_["Type"]
}

export declare namespace ExtensionPayload {
  export type Any = ExtensionPayload<string, Info>
}

export const Service =
  <Self>() =>
  <Identifier extends string, K extends string, Info_ extends Info, Enrichment_ extends Enrichment<Info_>>(
    id: Identifier,
    definition: {
      readonly xKey: K
      readonly info: Info_
      readonly enrichment: Enrichment_
    },
  ): Extension<Self, Identifier, K, Info_, Enrichment_> => {
    const tag = Context.Service<Self, Service<Enrichment_>>()(id)
    const make = (info: Info_["Type"]) => ({
      xKey: definition.xKey,
      infoSchema: definition.info,
      info,
    })
    const extension: Extension<Self, Identifier, K, Info_, Enrichment_> = Object.assign(tag, {
      [TypeId]: TypeId,
      ...definition,
      make,
    })
    return extension
  }

// export const layerFromPayload = <
//   Self,
//   Identifier extends string,
//   K extends string,
//   Info extends Extension.Info,
//   Enrichment extends Extension.Enrichment<Info>,
// >(
//   extension: Extension<Self, Identifier, K, Info, Enrichment>,
//   payload: Payload | undefined,
// ): Layer.Layer<Self, S.SchemaError, Exclude<Enrichment["DecodingServices"], Scope.Scope>> =>
//   Layer.effect(
//     extension,
//     Effect.gen(function* () {
//       const info = payload?.extensions?.[extension.xKey]?.info
//       if (info) {
//         return yield* S.decodeEffect(S.toCodecJson(extension.enrichment))(info)
//       }
//       return
//     }),
//   )

// export interface ExtensionHandlerConfig<Info extends S.Top> {
//   readonly info: Info["Type"]
//   readonly payload: S.JsonObject
//   readonly accepted: Requirements
//   readonly required: Required
// }

// export class ExtensionRegistry extends Context.Reference<
//   Map<Extension.Any, (payload: ExtensionHandlerConfig<any>) => Effect.Effect<unknown>>
// >("crosshatch/ExtensionRegistry", {
//   defaultValue: () => new Map(),
// }) {}

// export const layerHandler = Effect.fnUntraced(function* <
//   Self,
//   K extends string,
//   Identifier extends string,
//   Info extends Extension.Info,
//   Enrichment extends Extension.Enrichment<Info>,
//   R,
// >(
//   extension: Extension<Self, K, Identifier, Info, Enrichment>,
//   f: (payload: ExtensionHandlerConfig<Info>) => Effect.Effect<Enrichment["Type"], never, R>,
// ) {
//   const registry = yield* ExtensionRegistry
//   const context = yield* Effect.context<R>()
//   registry.set(extension, flow(f, Effect.provide(Layer.succeedContext(context)), Effect.scoped))
//   return Layer.empty
// }, Layer.unwrap)
