import { Schema as S } from "effect"

export class Finished extends S.TaggedClass<Finished>()("Finished", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export interface WidgetConfig<A, I> {
  readonly src: string
  readonly event: S.Schema<A, I>
}

export const parent = (() => {
  try {
    if (globalThis.self !== globalThis.top) {
      return globalThis.top
    }
    // oxlint-disable-next-line no-unused-vars
  } catch (_e: unknown) {}
  return null
})()

export const postFinished = () => parent?.postMessage(new Finished(), "*")
