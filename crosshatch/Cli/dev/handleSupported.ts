import { Facilitator } from "crosshatch"
import { Effect } from "effect"

import { handler } from "./_common.ts"

export const handleSupported = handler(
  Facilitator.FacilitatorApi,
  "facilitator",
  "supported",
  Effect.fn(function* () {
    return null!
  }),
)
