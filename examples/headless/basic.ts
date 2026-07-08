import { KnownAssets, Facilitator, Required, Requirements, Payload } from "crosshatch"
import { EvmAddress } from "crosshatch/Evm"
import { Effect } from "effect"

import { PayerLive } from "./_common.ts"

Effect.gen(function* () {
  const EVM_ADDRESS = yield* EvmAddress.config("PAY_TO_EVM")
  const required = yield* Required.make`
  |
  | Description of the charge.
  |
  `.pipe(
    Required.accept(
      Requirements.asset(KnownAssets.USDC, {
        amount: 0.01,
        recipients: { eip155: { 8453: EVM_ADDRESS } },
        ttl: "1 minutes",
      }),
    ),
  )
  const { payload } = yield* Payload.make({ required })
  yield* Facilitator.settle({ payload })
}).pipe(Effect.provide(PayerLive), Effect.runFork)
