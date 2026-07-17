import { Effect } from "effect"

import { FacilitatorApi } from "../../Facilitator/FacilitatorApi.ts"
import { handler } from "./_common.ts"

export const handleVerify = handler(FacilitatorApi, "facilitator", "verify", () => Effect.succeed({ isValid: true }))
