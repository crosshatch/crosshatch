import { Schema as S } from "effect"

export type WidgetConfig<A, I> = {
  readonly src: string
  readonly item?: S.Codec<A, I> | undefined
}

export const parent = globalThis.parent ?? globalThis.opener

export const Finished = S.TaggedStruct("Finished", {})

export const postFinished = () => parent.postMessage(Finished.make({}), "*")
