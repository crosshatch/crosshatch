import { Required, Payer } from "crosshatch"
import { Address } from "crosshatch/Cryptocurrency"
import { Eip155 } from "crosshatch/Cryptocurrency/Eip155"
import { Solana } from "crosshatch/Cryptocurrency/Solana"
import { USDC } from "crosshatch/Cryptocurrency/token-deployments"
import { Config, Effect, Array, Console } from "effect"

// import { layerPrelude } from "./layerPayer.ts"

const amount = ""

Effect.gen(function* () {
  const recipients = yield* Config.all({
    eip155: Address.fromConfig(Eip155, "EIP155_RECIPIENT"),
    solana: Address.fromConfig(Solana, "SOLANA_RECIPIENT"),
  })

  const accepts = Array.flatten([
    USDC.accepts({ amount, recipients }),
    USDC.accepts({ amount, recipients }),
    USDC.base_mainnet.accepts({ amount, recipients }),
  ])

  const required = yield* Required.describe`
  |
  | Description of the charge.
  |
  `(accepts)

  const payload = yield* Payer.make(required)

  // const settlement = yield* Facilitator.settle({ payload })
  yield* Console.log(payload)
}).pipe(Effect.provide(Payer.layer), Effect.runFork)
