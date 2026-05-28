import type { AccountAddress } from "@crosshatch/caip"
import { Context, Layer } from "effect"

export class Merchant extends Context.Service<
  Merchant,
  {
    readonly url: string
    readonly treasury: typeof AccountAddress.Type
  }
>()("@crosshatch/merchant/Merchant") {
  static readonly layer = Layer.succeed(this)
}
