import { Effect } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"

import { FacilitatorApi } from "../FacilitatorApi/index.ts"

export const verify = HttpApiBuilder.handler(FacilitatorApi, "facilitator", "verify", () =>
  Effect.succeed({ isValid: true }),
)
