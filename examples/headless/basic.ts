import { Accepts } from "crosshatch"
import { Address } from "crosshatch/Cryptocurrency"
import { Eip155 } from "crosshatch/Cryptocurrency/namespaces/Eip155"
import { USDC } from "crosshatch/Cryptocurrency/token-deployments"
import { Config, Console, Effect } from "effect"

import { layerPrelude } from "./layerPayer.ts"

Effect.gen(function* () {
  const recipients = yield* Config.all({
    eip155: Address.fromConfig(Eip155, "EIP155_RECIPIENT"),
    solana: Address.fromConfig(Solana, "SOLANA_RECIPIENT"),
  })
  const accepts = Accepts.empty.pipe(
    Accepts.add(USDC, { amount: "", recipients }),
    Accepts.add(USDC.base_mainnet, { amount: "", recipients }),
  )
  const required = yield* Required.describe`
  | Description of the charge
  `(accepts)
  const payload = yield* Payload.make(required)
  const settlement = yield* Facilitator.settle({ payload })
  yield* Console.log(settlement)
}).pipe(Layer.provide(layerPrelude), Effect.runFork)
