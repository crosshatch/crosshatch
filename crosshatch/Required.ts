import { String, Pipeable, Schema as S, Record, Effect } from "effect"

import { InvalidAmountError } from "./Amount.ts"
import type { Extension } from "./Extension.ts"
import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Required = S.Struct({
  accepts: S.Array(Requirements),
  error: S.String.pipe(S.optional),
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  resource: ResourceInfo,
  x402Version: Version,
})

export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(
  S.decodeTo(S.fromJsonString(S.toCodecJson(Required))),
)

export type AcceptsInput =
  | typeof Requirements.Type
  | Effect.Effect<typeof Requirements.Type, InvalidAmountError>
  | Array<typeof Requirements.Type>
  | Effect.Effect<Array<typeof Requirements.Type>, InvalidAmountError>

export interface Builder_<R> extends Pipeable.Pipeable {
  readonly ""?: [R]
  readonly url: string
  readonly extensionsEntries?: ReadonlyArray<[Extension.Any, unknown]> | undefined
  readonly acceptsInputs?: ReadonlyArray<AcceptsInput> | undefined
}

export interface Builder<R> extends Builder_<R> {
  (
    template?: TemplateStringsArray | string,
    ...substitutions: ReadonlyArray<unknown>
  ): Effect.Effect<typeof Required.Type, S.SchemaError | InvalidAmountError, R>
}

export const builder = ({ url }: { readonly url: string }): Builder_<never> => ({
  url,
  pipe() {
    return Pipeable.pipeArguments(this, arguments)
  },
})

const make = <R>(
  builder: Builder_<R>,
  {
    acceptsInputs,
    extensionEntries,
  }: {
    readonly acceptsInputs: ReadonlyArray<AcceptsInput>
    readonly extensionEntries: ReadonlyArray<[Extension.Any, unknown]>
  },
): Builder<R> => {
  const { url, extensionsEntries: extensions } = builder
  return Object.assign(
    Effect.fnUntraced(function* (template?: TemplateStringsArray | string, ...substitutions: ReadonlyArray<unknown>) {
      return {
        x402Version: 2,
        accepts: yield* Effect.forEach(acceptsInputs, (v) => (Effect.isEffect(v) ? v : Effect.succeed(v))).pipe(
          Effect.map((v) => v.flat()),
        ),
        resource: {
          url,
          ...(template
            ? {
                description:
                  typeof template === "string"
                    ? template
                    : String.stripMargin(globalThis.String.raw(template, ...substitutions)),
              }
            : {}),
        },
        extensions: yield* Effect.all(
          extensionEntries?.map(([{ identifier, payload: Payload }, payload]) =>
            S.encodeEffect(S.toCodecJson(Payload))(payload).pipe(
              Effect.map((encoded) => [identifier, encoded] as const),
            ),
          ) ?? [],
          { concurrency: "unbounded" },
        ).pipe(Effect.map(Record.fromEntries)) as Effect.Effect<never, S.SchemaError, R>,
      } satisfies typeof Required.Type
    }),
    {
      url,
      acceptsInputs,
      extensionsEntries: extensions,
      pipe() {
        return Pipeable.pipeArguments(this, arguments)
      },
    } satisfies Builder_<R>,
  )
}

export const accept =
  (...acceptsInputs: ReadonlyArray<AcceptsInput>) =>
  <R>(builder: Builder_<R>): Builder<R> =>
    make(builder, {
      acceptsInputs: [...(builder.acceptsInputs ?? []), ...acceptsInputs],
      extensionEntries: builder.extensionsEntries ?? [],
    })

export const extend =
  <K extends string, Payload extends S.Top, Success extends S.Top & { readonly Type: Payload["Type"] }>(
    extension: Extension<K, Payload, Success>,
    payload: Payload["Type"],
  ) =>
  <R>(builder: Builder_<R>): Builder<R | Payload["EncodingServices"]> =>
    make(builder, {
      acceptsInputs: builder.acceptsInputs ?? [],
      extensionEntries: [...(builder.extensionsEntries ?? []), [extension, payload]],
    })
