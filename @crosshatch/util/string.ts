import { String } from "effect"

export const stringRaw = (template: TemplateStringsArray | string, substitutions: ReadonlyArray<unknown>) =>
  typeof template === "string"
    ? template.trim()
    : String.stripMargin(
        globalThis.String.raw(template, ...(substitutions ?? [])).replace(/(?<margin>^[ \t]*\|) /gmu, "$<margin>"),
      ).trim()
