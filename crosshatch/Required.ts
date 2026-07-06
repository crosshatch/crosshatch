import { String, Schema as S, Effect, Context } from "effect"

import { InvalidAmountError } from "./Amount.ts"
import type { Extension } from "./Extension.ts"
import { Requirements, type RequirementsLike } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Required = S.Struct({
  x402Version: Version,
  resource: ResourceInfo,
  accepts: S.Array(Requirements),
  error: S.String.pipe(S.optional),
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
})

export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(
  S.decodeTo(S.fromJsonString(S.toCodecJson(Required))),
)

export interface RequiredEmpty {
  x402Version: typeof Version.Type
  resource: typeof ResourceInfo.Type
  accepts: []
  error?: undefined
  extensions?: undefined
}

export type RequiredLike = RequiredEmpty | typeof Required.Type

export class RequiredUrl extends Context.Reference<string | undefined>("crosshatch/RequiredUrl", {
  defaultValue: () => undefined,
}) {}

export const make = Effect.fnUntraced(function* (
  template?: TemplateStringsArray | string,
  ...substitutions: ReadonlyArray<unknown>
): Effect.fn.Return<RequiredEmpty> {
  const url = yield* RequiredUrl
  return {
    accepts: [],
    x402Version: 2,
    resource: {
      url,
      ...(template && {
        description:
          typeof template === "string"
            ? template
            : String.stripMargin(globalThis.String.raw(template, ...(substitutions ?? []))),
      }),
    },
  }
})

export const accept =
  (...acceptsInputs: ReadonlyArray<RequirementsLike>) =>
  <E, R>(effect: Effect.Effect<RequiredLike, E, R>): Effect.Effect<typeof Required.Type, E | InvalidAmountError, R> =>
    Effect.flatMap(
      effect,
      Effect.fnUntraced(function* ({ accepts, ...rest }) {
        return {
          ...rest,
          accepts: yield* Effect.forEach(acceptsInputs ?? [], (v) => (Effect.isEffect(v) ? v : Effect.succeed(v))).pipe(
            Effect.map((v) => v.flat()),
          ),
        } satisfies typeof Required.Type
      }),
    )

export const extend =
  <
    Self,
    K extends string,
    Name extends string,
    ExtensionPayload extends Extension.Payload,
    Success extends Extension.Success<ExtensionPayload>,
  >(
    extension: Extension<Self, K, Name, ExtensionPayload, Success>,
    payload: ExtensionPayload["Type"],
  ) =>
  <A extends RequiredLike, E, R>(
    effect: Effect.Effect<A, E, R>,
  ): Effect.Effect<A, E | S.SchemaError, R | ExtensionPayload["EncodingServices"]> =>
    Effect.flatMap(
      effect,
      Effect.fnUntraced(function* ({ extensions, ...rest }) {
        return {
          ...rest,
          extensions: {
            ...extensions,
            [extension.identifier]: yield* S.encodeEffect(S.toCodecJson(extension.payload))(payload),
          },
        } as A
      }),
    )
