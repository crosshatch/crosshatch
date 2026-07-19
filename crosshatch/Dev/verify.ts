import { Effect } from "effect"

import { handler } from "../_util.ts"
import { FacilitatorApi } from "../FacilitatorApi/FacilitatorApi.ts"

export const verify = handler(FacilitatorApi, "facilitator", "verify", () => Effect.succeed({ isValid: true }))
