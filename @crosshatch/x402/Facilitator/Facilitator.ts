import { HttpApi, HttpApiGroup } from "effect/unstable/httpapi"

import { Settle } from "./Settle.ts"
import { Supported } from "./Supported.ts"
import { Verify } from "./Verify.ts"

export class Facilitator extends HttpApiGroup.make("facilitator").add(Verify).add(Settle).add(Supported) {}

export class FacilitatorApi extends HttpApi.make("facilitator").add(Facilitator) {}
