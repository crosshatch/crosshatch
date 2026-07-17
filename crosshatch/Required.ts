import { Schema as S, Effect, Context } from "effect"

import { JsonRecord, stringRaw } from "./_util.ts"
import { InvalidAmountError } from "./Amount.ts"
import type { Extension } from "./Extension.ts"
import { Requirements, type RequirementsLike } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export type Required = typeof Required.Type
export const Required = S.Struct({
  x402Version: Version,
  resource: ResourceInfo,
  accepts: S.Array(Requirements),
  error: S.String.pipe(S.optional),
  extensions: JsonRecord.pipe(S.optional),
})

export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(
  S.decodeTo(S.fromJsonString(S.toCodecJson(Required))),
)

export class RequiredUrl extends Context.Reference<string | undefined>("crosshatch/RequiredUrl", {
  defaultValue: () => undefined,
}) {}

export const make = Effect.fnUntraced(function* (
  template?: TemplateStringsArray | string,
  ...substitutions: ReadonlyArray<unknown>
) {
  const url = yield* RequiredUrl
  return {
    accepts: [],
    x402Version: 2,
    resource: {
      url,
      ...(template && {
        description: stringRaw(template, substitutions),
      }),
    },
  } satisfies Required
})

export const accept =
  (...acceptsInputs: ReadonlyArray<RequirementsLike>) =>
  <E, R>(effect: Effect.Effect<Required, E, R>): Effect.Effect<Required, E | InvalidAmountError, R> =>
    Effect.flatMap(
      effect,
      Effect.fnUntraced(function* ({ accepts, ...rest }) {
        return {
          ...rest,
          accepts: yield* Effect.forEach(acceptsInputs ?? [], (v) => (Effect.isEffect(v) ? v : Effect.succeed(v))).pipe(
            Effect.map((v) => v.flat()),
          ),
        }
      }),
    )

export const extend =
  <
    Self,
    K extends string,
    Name extends string,
    ExtensionPayload extends Extension.Info,
    Enrichment extends Extension.Enrichment<ExtensionPayload>,
  >(
    extension: Extension<Self, K, Name, ExtensionPayload, Enrichment>,
    payload: ExtensionPayload["Type"],
  ) =>
  <E, R>(
    effect: Effect.Effect<Required, E, R>,
  ): Effect.Effect<Required, E | S.SchemaError, R | ExtensionPayload["EncodingServices"]> =>
    Effect.flatMap(
      effect,
      Effect.fnUntraced(function* ({ extensions, ...rest }) {
        return {
          ...rest,
          extensions: {
            ...extensions,
            [extension.identifier]: yield* S.encodeEffect(S.toCodecJson(extension.info))(payload),
          },
        }
      }),
    )
