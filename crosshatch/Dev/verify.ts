import { Effect } from "effect"

import { FacilitatorApi } from "../FacilitatorApi/index.ts"
import { handler } from "../util/index.ts"

export const verify = handler(FacilitatorApi, "facilitator", "verify", () => Effect.succeed({ isValid: true }))
