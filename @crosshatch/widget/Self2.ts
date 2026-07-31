import { Schema as S } from "effect"

export type WidgetConfig<Item extends S.Codec<any, any>> = {
  readonly src: string
  readonly item: Item
}

export const parent = globalThis.parent ?? globalThis.opener

export const Finished = S.TaggedStruct("Finished", {})

export const postFinished = () => parent.postMessage(Finished.make({}), "*")
