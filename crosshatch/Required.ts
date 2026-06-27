import { String, Pipeable, Schema as S, Array, Record, Effect } from "effect"

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

export interface Builder_<R> extends Pipeable.Pipeable {
  readonly ""?: [R]
  readonly url: string
  readonly extensionsEntries?: ReadonlyArray<[Extension.Any, unknown]> | undefined
  readonly accepts?: ReadonlyArray<typeof Requirements.Type> | undefined
}

export interface Builder<R> extends Builder_<R> {
  (
    template?: TemplateStringsArray | string,
    ...substitutions: ReadonlyArray<unknown>
  ): Effect.Effect<typeof Required.Type, S.SchemaError, R>
}

export const empty = ({ url }: { readonly url: string }): Builder_<never> => ({
  url,
  pipe() {
    return Pipeable.pipeArguments(this, arguments)
  },
})

const make = <R>(
  builder: Builder_<R>,
  {
    accepts,
    extensionEntries,
  }: {
    readonly accepts: ReadonlyArray<typeof Requirements.Type>
    readonly extensionEntries: ReadonlyArray<[Extension.Any, unknown]>
  },
): Builder<R> => {
  const { url, extensionsEntries: extensions } = builder
  return Object.assign(
    Effect.fnUntraced(function* (template?: TemplateStringsArray | string, ...substitutions: ReadonlyArray<unknown>) {
      return {
        x402Version: 2,
        accepts,
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
      accepts,
      extensionsEntries: extensions,
      pipe() {
        return Pipeable.pipeArguments(this, arguments)
      },
    } satisfies Builder_<R>,
  )
}

export const accept =
  (...accepts_: ReadonlyArray<typeof Requirements.Type | ReadonlyArray<typeof Requirements.Type>>) =>
  <R>(builder: Builder_<R>): Builder<R> =>
    make(builder, {
      accepts: [...(builder.accepts ?? []), ...Array.flatMap(accepts_, Array.ensure)],
      extensionEntries: builder.extensionsEntries ?? [],
    })

export const extend =
  <K extends string, Payload extends S.Top, Success extends S.Top & { readonly Type: Success["Type"] }>(
    extension: Extension<K, Payload, Success>,
    payload: Payload["Type"],
  ) =>
  <R>(builder: Builder_<R>): Builder<R | Payload["EncodingServices"]> =>
    make(builder, {
      accepts: builder.accepts ?? [],
      extensionEntries: [...(builder.extensionsEntries ?? []), [extension, payload]],
    })
