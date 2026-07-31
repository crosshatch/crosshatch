import { Schema as S } from "effect"

export const parent = globalThis.parent ?? globalThis.opener

export const Finished = S.TaggedStruct("Finished", {})

export const postFinished = () => parent.postMessage(Finished.make({}), "*")
