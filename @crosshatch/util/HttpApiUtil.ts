import type { Context } from "effect"

import { OpenApi } from "@effect/platform"

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
