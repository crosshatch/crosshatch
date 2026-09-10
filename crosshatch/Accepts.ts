import { Schema as S, Array } from "effect"

import * as Requirements from "./Requirements.ts"

export type Accepts = typeof Accepts.Type
export const Accepts = S.Array(Requirements.Requirements)

export const isAcceptable = (accepts: Accepts, requirements: Requirements.Requirements): boolean =>
  Array.some(accepts, (v) => Requirements.equals(v, requirements))
