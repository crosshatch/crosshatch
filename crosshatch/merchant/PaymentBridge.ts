import type { AccountAddress } from "@crosshatch/caip"
import { Context, Effect } from "effect"

import type { RequiredEnvelope } from "./RequiredEnvelope.ts"

export class PaymentBridge extends Context.Service<
  PaymentBridge,
  {
    readonly recipient: typeof AccountAddress.Type
    readonly take: (envelope: typeof RequiredEnvelope.Type) => Effect.Effect<void>
  }
>()("crosshatch/PaymentBridge") {}
