import { Effect } from "effect"

import { FacilitatorApi } from "../../FacilitatorApi/FacilitatorApi.ts"
import { handler } from "./_common.ts"

export const handleVerify = handler(FacilitatorApi, "facilitator", "verify", () => Effect.succeed({ isValid: true }))
