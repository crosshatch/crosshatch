import { Pipeable, Schema as S } from "effect"

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

export interface BuilderEmpty extends Pipeable.Pipeable {}

export interface Builder extends Pipeable.Pipeable {
  (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>): typeof Required.Type
}

export declare const builder: ({ url }: { readonly url: string }) => BuilderEmpty

export declare const accepts: (
  ...requirements: ReadonlyArray<typeof Requirements.Type | ReadonlyArray<typeof Requirements.Type>>
) => (builder: BuilderEmpty | Builder) => Builder
