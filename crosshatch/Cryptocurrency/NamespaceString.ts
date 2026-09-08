import { Schema as S } from "effect"

import * as Proto from "../_Proto.ts"

export type NamespaceString = typeof NamespaceString.Type
export const NamespaceString = S.String.check(S.isPattern(/^[-a-z0-9]{3,8}$/u)).pipe(
  S.brand(Proto.key("NamespaceString")),
)
