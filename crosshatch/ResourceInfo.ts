import { PrintableAscii32 } from "@crosshatch/util"
import { Schema as S, Context, Layer, Effect, Predicate, Struct } from "effect"

type ResourceInfo_ = typeof ResourceInfo_.Type
const ResourceInfo_ = S.Struct({
  description: S.String.pipe(S.optional),
  url: S.String.pipe(S.optional),
  mimeType: S.String.pipe(S.optional),
  serviceName: PrintableAscii32.pipe(S.optional),
  tags: S.Array(PrintableAscii32).check(S.isMaxLength(5)).pipe(S.optional),
  iconUrl: S.String.check(S.isLengthBetween(1, 2048), S.isPattern(/^https?:\/\/.+/u)).pipe(S.optional),
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface ResourceInfo extends ResourceInfo_ {}

export const ResourceInfo = Object.assign(
  Context.Service<ResourceInfo, ResourceInfo>()("crosshatch/ResourceInfo"),
  ResourceInfo_,
)

export const layer = Layer.succeed(ResourceInfo)

export const layerSetter = Effect.fnUntraced(function* (
  setter: Partial<ResourceInfo> | ((info: ResourceInfo) => ResourceInfo),
) {
  const info = yield* ResourceInfo
  if (Predicate.isFunction(setter)) {
    return setter(info)
  }
  return Struct.assign(info, setter)
}, Layer.effect(ResourceInfo))
