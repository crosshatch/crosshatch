import { Schema as S } from "effect"

import { getOrUndefined } from "../ParentContext.ts"

export class Close extends S.TaggedClass<Close>()("Close", {}) {
  static decodeOption = S.decodeUnknownOption(this)
}

export interface WidgetConfig<A, I> {
  readonly src: string
  readonly event: S.Schema<A, I>
}

export const closeSelf = () => getOrUndefined()?.postMessage(new Close(), "*")
