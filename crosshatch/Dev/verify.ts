import { handler } from "@crosshatch/util/httpapi"
import { Effect } from "effect"

import { FacilitatorApi } from "../FacilitatorApi/index.ts"

export const verify = handler(FacilitatorApi, "facilitator", "verify", () => Effect.succeed({ isValid: true }))
