import { KnownAssets, Facilitator, Required, Requirements, Payload } from "crosshatch"
import { BrowserPayer } from "crosshatch/Browser"
import { EvmAddress } from "crosshatch/Evm"
import { Effect } from "effect"

Effect.gen(function* () {
  const EVM_ADDRESS = yield* EvmAddress.env
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
}).pipe(Effect.provide(BrowserPayer.layer), Effect.runFork)
