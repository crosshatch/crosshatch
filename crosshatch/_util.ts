import { String, Schema as S } from "effect"

export type JsonRecord = typeof JsonRecord.Type
export const JsonRecord = S.Record(S.String, S.Json)

export const stringRaw = (template: TemplateStringsArray | string, substitutions: ReadonlyArray<unknown>) =>
  typeof template === "string"
    ? template.trim()
    : String.stripMargin(
        globalThis.String.raw(template, ...(substitutions ?? [])).replace(/(?<margin>^[ \t]*\|) /gmu, "$<margin>"),
      ).trim()
