import { HttpApi, HttpApiGroup } from "effect/unstable/httpapi"

import { SettleEndpoint } from "./SettleEndpoint.ts"
import { SupportedEndpoint } from "./SupportedEndpoint.ts"
import { VerifyEndpoint } from "./VerifyEndpoint.ts"

export * from "./VerifyEndpoint.ts"
export * from "./SettleEndpoint.ts"
export * from "./SupportedEndpoint.ts"

export class FacilitatorApiGroup extends HttpApiGroup.make("facilitator")
  .add(VerifyEndpoint)
  .add(SettleEndpoint)
  .add(SupportedEndpoint) {}

export class FacilitatorApi extends HttpApi.make("facilitator").add(FacilitatorApiGroup) {}
