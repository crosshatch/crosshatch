import { Schema as S } from "effect"

import * as Proto from "../_Proto.ts"

export type ReferenceString = typeof ReferenceString.Type
export const ReferenceString = S.String.check(S.isPattern(/^[-_a-zA-Z0-9]{1,32}$/u)).pipe(
  S.brand(Proto.id("Reference")),
)
