import { PrintableAscii32 } from "@crosshatch/util"
import { Schema as S, Context, Layer, Effect, Predicate, Pipeable, SchemaGetter } from "effect"

import * as Proto from "./_Proto.ts"

const TypeId = Proto.id("ResourceInfo")

type ResourceInfoFields = typeof ResourceInfoFields.Type
const ResourceInfoFields = S.Struct({
  description: S.String.pipe(S.optional),
  url: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
  serviceName: PrintableAscii32.pipe(S.optional),
  tags: S.Array(PrintableAscii32).check(S.isMaxLength(5)).pipe(S.optional),
  iconUrl: S.URLFromString.pipe(S.optional),
})

export interface ResourceInfo extends ResourceInfoFields, Pipeable.Pipeable {
  [TypeId]: typeof TypeId
}

export const isResourceInfo = (v: unknown): v is ResourceInfo => Predicate.hasProperty(v, TypeId)

export const make = (v: ResourceInfoFields): ResourceInfo => ({ ...Proto.make(TypeId), ...v })

export const ResourceInfo = Object.assign(
  Context.Service<ResourceInfo, ResourceInfo>()("crosshatch/ResourceInfo"),
  ResourceInfoFields.pipe(
    S.decodeTo(S.declare(isResourceInfo), {
      decode: SchemaGetter.transform(make),
      encode: SchemaGetter.transform(({ description, url, mimeType, serviceName, tags, iconUrl }) => ({
        description,
        url,
        mimeType,
        serviceName,
        tags,
        iconUrl,
      })),
    }),
  ),
)

export const layer: (resource: ResourceInfo) => Layer.Layer<ResourceInfo, never, never> = Layer.succeed(ResourceInfo)

export const layerSetter: (
  settle: (info: ResourceInfo) => ResourceInfo,
) => Layer.Layer<ResourceInfo, never, ResourceInfo> = Effect.fnUntraced(function* (setter) {
  const info = yield* ResourceInfo
  return setter(info)
}, Layer.effect(ResourceInfo))
