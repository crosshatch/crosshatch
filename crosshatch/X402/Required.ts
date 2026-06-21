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
  (...accepts_: ReadonlyArray<typeof Requirements.Type | ReadonlyArray<typeof Requirements.Type>>) =>
  (builder: BuilderEmpty | Builder): Builder => {
    // TODO: are we okay lying about non-empty with lack of assertion just to keep it sync?
    const accepts = [...(builder.accepts ?? []), ...Array.flatMap(accepts_, Array.ensure)] as Array.NonEmptyArray<
      typeof Requirements.Type
    >
    return Object.assign(
      (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
        ({
          x402Version: 2,
          accepts,
          resource: {
            url: builder.url,
            description: String.raw(template, ...substitutions),
          },
        }) satisfies typeof Required.Type,
      {
        url: builder.url,
        accepts,
        pipe() {
          return Pipeable.pipeArguments(this, arguments)
        },
      } satisfies Builder_,
    )
  }
