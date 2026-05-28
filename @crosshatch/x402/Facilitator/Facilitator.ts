import { HttpApiGroup } from "effect/unstable/httpapi"

import { Settle } from "./Settle.ts"
import { Supported } from "./Supported.ts"
import { Verify } from "./Verify.ts"

export * from "./Settle.ts"
export * from "./Supported.ts"
export * from "./Verify.ts"

export const Facilitator = HttpApiGroup.make("facilitator").add(Verify).add(Settle).add(Supported)
