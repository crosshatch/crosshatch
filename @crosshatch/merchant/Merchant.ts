import type { AccountAddress } from "@crosshatch/caip"
import { Context, Layer } from "effect"

export class Merchant extends Context.Service<
  Merchant,
  {
    readonly url: string
    readonly treasury: typeof AccountAddress.Type
    readonly facilitator?: string | undefined
  }
>()("@crosshatch/merchant/Merchant") {}

export const layer = (metadata: Merchant["Service"]) => Layer.succeed(Merchant, metadata)
