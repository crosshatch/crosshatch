import { Schema as S, Context, Layer, Effect, Scope } from "effect"

import type { Payload } from "./Payload.ts"

const TypeId = "~crosshatch/Extension" as const

export type Service<Success extends S.Top> = Success["Type"] | undefined

export interface Extension<
  Self,
  Id extends string,
  Identifier extends string,
  ExtensionPayload extends S.Top & { readonly DecodingServices: never },
  Success extends S.Top & { readonly Type: ExtensionPayload["Type"] },
> extends Context.Service<Self, Service<Success>> {
  new (_: never): Context.ServiceClass.Shape<Id, Service<Success>>

  readonly [TypeId]: typeof TypeId

  readonly identifier: Identifier

  readonly payload: ExtensionPayload

  readonly success: Success

  readonly layer: ({
    payload,
  }: {
    readonly payload: typeof Payload.Type | undefined
  }) => Layer.Layer<Self, S.SchemaError, Exclude<Success["DecodingServices"], Scope.Scope>>
}

export declare namespace Extension {
  export type Any = Extension<
    any,
    string,
    string,
    S.Top & { readonly DecodingServices: never },
    S.Top & { readonly EncodingServices: never }
  >
}

export const Service =
  <Self>() =>
  <
    Id extends string,
    Identifier extends string,
    ExtensionPayload extends S.Top & { readonly DecodingServices: never },
    Success extends S.Top & {
      readonly Type: ExtensionPayload["Type"]
      readonly EncodingServices: never
    },
  >(
    id: Id,
    definition: {
      readonly identifier: Identifier
      readonly payload: ExtensionPayload
      readonly success: Success
    },
  ): Extension<Self, Id, Identifier, ExtensionPayload, Success> => {
    const tag = Context.Service<Self, Service<Success>>()(id)
    const { success } = definition

    const layer = ({ payload }: { readonly payload: typeof Payload.Type | undefined }) =>
      Layer.effect(
        tag,
        Effect.gen(function* () {
          const entry = payload?.extensions?.[definition.identifier]
          if (entry) {
            return yield* S.decodeUnknownEffect(S.toCodecJson(success))(entry)
          }
          return
        }),
      )

    return Object.assign(tag, {
      [TypeId]: TypeId,
      ...definition,
      layer,
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
  Name extends string,
  ExtensionPayload extends S.Top & { readonly DecodingServices: never },
  Success extends S.Top & {
    readonly Type: ExtensionPayload["Type"]
    readonly EncodingServices: never
  },
  R,
>(
  extension: Extension<Self, Id, Name, ExtensionPayload, Success>,
  f: (payload: ExtensionPayload["Type"]) => Effect.Effect<Success["Type"], never, R>,
) {
  const registry = yield* ExtensionRegistry
  registry.set(extension, f as never)
  return Layer.empty
}, Layer.unwrap)
