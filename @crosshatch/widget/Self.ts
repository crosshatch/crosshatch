import { Schema as S, Struct } from "effect"

export const parent = () => globalThis.opener ?? globalThis.parent

const ChxWidgetEventTypeId = "~@crosshatch/widget/Self/ChxWidgetEvent" as const

const fields = Struct.assign({
  [ChxWidgetEventTypeId]: S.tag(ChxWidgetEventTypeId),
})

export const ChxWidgetEvent = S.TaggedUnion({
  Done: fields({}),
})

export const postFinished = () => parent().postMessage(ChxWidgetEvent.cases.Done.make({}), "*")
