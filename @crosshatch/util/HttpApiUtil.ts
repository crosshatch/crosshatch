import { OpenApi } from "@effect/platform"
import type { Context } from "effect"

export const description =
  (template: TemplateStringsArray, ...substitutions: Array<unknown>) =>
  <
    A extends {
      annotate<I, S>(tag: Context.Tag<I, S>, value: S): A
    },
  >(
    annotatable: A,
  ) =>
    annotatable.annotate(
      OpenApi.Description,
      String.raw(template, ...substitutions)
        .split("\n")
        .join(" "),
    )
