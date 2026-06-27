import { Facilitator } from "crosshatch"
import { Effect } from "effect"
import { HttpApiBuilder } from "effect/unstable/httpapi"

import { handleSettle } from "./handleSettle.ts"
import { handleSupported } from "./handleSupported.ts"
import { handleVerify } from "./handleVerify.ts"

export const FacilitatorLive = HttpApiBuilder.group(Facilitator.FacilitatorApi, "facilitator", (_) =>
  Effect.succeed(_.handle("settle", handleSettle).handle("verify", handleVerify).handle("supported", handleSupported)),
)
