import { Pipeable, Schema as S, Array } from "effect"

import { Requirements } from "./Requirements.ts"
import { ResourceInfo } from "./ResourceInfo.ts"
import { Version } from "./Version.ts"

export const Accepts = S.NonEmptyArray(Requirements)

export const Required = S.Struct({
  accepts: Accepts,
  error: S.String.pipe(S.optional),
  extensions: S.Record(S.String, S.Unknown).pipe(S.optional),
  resource: ResourceInfo,
  x402Version: Version,
})

export const RequiredFromBase64JsonString = S.StringFromBase64.pipe(
  S.decodeTo(S.fromJsonString(S.toCodecJson(Required))),
)

export interface BuilderEmpty extends Pipeable.Pipeable {
  readonly url: string
  readonly accepts?: never
}

interface Builder_ extends Pipeable.Pipeable {
  readonly url: string
  readonly accepts: ReadonlyArray<typeof Requirements.Type>
}

export interface Builder extends Builder_ {
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>): typeof Required.Type
}

export const builder = ({ url }: { readonly url: string }): BuilderEmpty => ({
  url,
  pipe() {
    return Pipeable.pipeArguments(this, arguments)
  },
})

export const accepts =
  (...accepts: ReadonlyArray<typeof Requirements.Type | ReadonlyArray<typeof Requirements.Type>>) =>
  (builder: BuilderEmpty | Builder): Builder =>
    Object.assign(
      (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
        ({
          x402Version: 2,
          accepts: [...(builder.accepts ?? []), ...accepts.flat(1)] as Array.NonEmptyArray<typeof Requirements.Type>,
          resource: {
            url: builder.url,
            description: String.raw(template, ...substitutions),
          },
        }) satisfies typeof Required.Type,
      {
        url: builder.url,
        accepts: [...(builder.accepts ?? []), ...accepts.flat(1)],
        pipe() {
          return Pipeable.pipeArguments(this, arguments)
        },
      } satisfies Builder_,
    )
