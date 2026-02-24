import { Schema as S } from "effect"

export interface WidgetConfig<A, I> {
  readonly src: string
  readonly item?: S.Schema<A, I> | undefined
}

export const parent = globalThis.parent ?? globalThis.opener

export const Finished = S.TaggedStruct("Finished", {})

export const postFinished = () => parent.postMessage(Finished.make(), "*")
