import { String } from "effect"

export const stringRaw = (template: TemplateStringsArray, substitutions: ReadonlyArray<unknown>) =>
  String.stripMargin(
    globalThis.String.raw(template, ...(substitutions ?? [])).replace(/(?<margin>^[ \t]*\|) /gmu, "$<margin>"),
  ).trim()

export const normalizeStringRaw = (
  template: TemplateStringsArray | string | undefined,
  substitutions: ReadonlyArray<unknown>,
) => (template ? (typeof template === "string" ? template : stringRaw(template, substitutions)) : undefined)
