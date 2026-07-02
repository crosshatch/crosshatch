import { HttpApi, HttpApiGroup } from "effect/unstable/httpapi"

import { SettleEndpoint } from "./endpoints/SettleEndpoint.ts"
import { SupportedEndpoint } from "./endpoints/SupportedEndpoint.ts"
import { VerifyEndpoint } from "./endpoints/VerifyEndpoint.ts"

export class FacilitatorApiGroup extends HttpApiGroup.make("facilitator")
  .add(VerifyEndpoint)
  .add(SettleEndpoint)
  .add(SupportedEndpoint) {}

export class FacilitatorApi extends HttpApi.make("facilitator").add(FacilitatorApiGroup) {}
