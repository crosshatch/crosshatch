import { HttpApi, HttpApiGroup } from "effect/unstable/httpapi"

import { SettleEndpoint } from "./endpoints/settle.ts"
import { SupportedEndpoint } from "./endpoints/supported.ts"
import { VerifyEndpoint } from "./endpoints/verify.ts"

export class FacilitatorApiGroup extends HttpApiGroup.make("facilitator")
  .add(VerifyEndpoint)
  .add(SettleEndpoint)
  .add(SupportedEndpoint) {}

export class FacilitatorApi extends HttpApi.make("facilitator").add(FacilitatorApiGroup) {}
