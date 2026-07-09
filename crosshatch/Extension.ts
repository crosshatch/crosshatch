import { Schema as S, Context, Layer, Effect, Scope, flow, Cause } from "effect"

import type { Payload } from "./Payload.ts"
import type { Required } from "./Required.ts"

const TypeId = "~crosshatch/Extension" as const

export type Service<Success extends S.Top> = Success["Type"] | undefined

export const ExtensionsInfo = S.Record(S.String, S.Json)

export interface Extension<
  Self,
  Id extends string,
  Identifier extends string,
  Info extends Extension.Info,
  Echo extends Extension.Echo<Info>,
> extends Context.Service<Self, Service<Echo>> {
  new (_: never): Context.ServiceClass.Shape<Id, Service<Echo>>

  readonly [TypeId]: typeof TypeId

  readonly identifier: Identifier

  readonly info: Info

  readonly echo: Echo

  readonly layer: ({
    payload,
  }: {
    readonly payload: typeof Payload.Type | undefined
  }) => Layer.Layer<Self, S.SchemaError, Exclude<Echo["DecodingServices"], Scope.Scope>>

  readonly ensure: Effect.Effect<Echo["Type"], Cause.NoSuchElementError, Self>

  readonly decodeRequired: (
    required: typeof Required.Type,
  ) => Effect.Effect<Info["Type"], S.SchemaError, Info["DecodingServices"]>

  readonly decodePayload: (
    payload: typeof Payload.Type,
  ) => Effect.Effect<Echo["Type"], S.SchemaError, Echo["DecodingServices"]>
}

export declare namespace Extension {
  export type Info = S.Top & { readonly DecodingServices: never }

  export type Echo<T extends S.Top> = T & {
    readonly Type: T["Type"]
    readonly EncodingServices: never
  }

  export type Any = Extension<any, string, string, Info, Echo<Info>>
}

export const Service =
  <Self>() =>
  <Id extends string, Identifier extends string, Info extends Extension.Info, Success extends Extension.Echo<Info>>(
    id: Id,
    definition: {
      readonly identifier: Identifier
      readonly info: Info
      readonly echo: Success
    },
  ): Extension<Self, Id, Identifier, Info, Success> => {
    const tag = Context.Service<Self, Service<Success>>()(id)
    const { info, echo, identifier } = definition

    const layer = ({ payload }: { readonly payload: typeof Payload.Type | undefined }) =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const entry = payload?.extensions?.[identifier]
          if (entry) {
            return yield* S.decodeUnknownEffect(S.toCodecJson(echo))(entry)
          }
          return
        }),
      )

    const ensure = Effect.flatMap(tag, Effect.fromNullishOr)

    const decodeRequired = (required: typeof Required.Type) =>
      S.decodeUnknownEffect(S.toCodecJson(info))(required.extensions?.[identifier])

    const decodePayload = (required: typeof Payload.Type) =>
      S.decodeUnknownEffect(S.toCodecJson(echo))(required.extensions?.[identifier])

    return Object.assign(tag, {
      [TypeId]: TypeId,
      ...definition,
      layer,
      ensure,
      decodeRequired,
      decodePayload,
    })
  }

export class ExtensionRegistry extends Context.Reference<
  Map<Extension.Any, (payload: any) => Effect.Effect<unknown, never, never>>
>("crosshatch/ExtensionRegistry", {
  defaultValue: () => new Map(),
}) {}

export const layerHandler = Effect.fnUntraced(function* <
  Self,
  Id extends string,
  Identifier extends string,
  Info extends Extension.Info,
  Success extends Extension.Echo<Info>,
  R,
>(
  extension: Extension<Self, Id, Identifier, Info, Success>,
  f: (payload: Info["Type"]) => Effect.Effect<Success["Type"], never, R>,
) {
  const registry = yield* ExtensionRegistry
  const context = yield* Effect.context<R>()
  registry.set(extension, flow(f, Effect.provide(Layer.succeedContext(context)), Effect.scoped))
  return Layer.empty
}, Layer.unwrap)
