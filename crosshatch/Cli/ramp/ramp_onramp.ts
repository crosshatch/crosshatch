import { Console, Effect, flow, Schema as S, Struct } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Amount from "../../Amount.ts"
import { Eip155Address } from "../../Eip155/Eip155.ts"
import * as HostMnemonic from "../../Host/HostMnemonic.ts"
import * as Mnemonic from "../../Mnemonic.ts"
import { CaAccountId } from "../../Ramp/CaAccountId.ts"
import { Providers } from "../../Ramp/RampApi.ts"
import { RampClient } from "../../Ramp/RampClient.ts"
import { Reference } from "../../Reference.ts"

export const onramp = Command.make("onramp", {
  mnemonic: Flag.string("mnemonic").pipe(Flag.withDefault(undefined), Flag.withDescription("Stored mnemonic name")),
  chain: Flag.string("chain").pipe(
    Flag.withDefault(undefined),
    Flag.withDescription("EIP-155 chain reference (e.g., 8453 for Base)"),
  ),
  amount: Flag.integer("amount").pipe(Flag.withDescription("Positive integer fiat amount")),
  provider: Flag.choice("provider", Providers).pipe(Flag.withDefault("Coinbase")),
}).pipe(
  Command.withDescription("Create an onramp URL for a stored mnemonic"),
  Command.withHandler(
    Effect.fn(
      function* ({ amount: amount_, chain, provider }) {
        const amount = yield* Amount.from(amount_)
        const chainRef = chain === undefined ? Reference.make("8453") : yield* S.decodeUnknownEffect(Reference)(chain)
        const chainId = `eip155:${chainRef}`
        const mnemonic = yield* Mnemonic.Mnemonic
        const address = yield* Eip155Address.fromMnemonic(mnemonic)
        const recipient = yield* S.decodeUnknownEffect(CaAccountId)(`${chainId}:${address}`)
        const ramp = yield* RampClient
        yield* ramp
          .onramp({ payload: { amount, provider, recipient } })
          .pipe(Effect.flatMap(flow(Struct.get("onrampUrl"), Console.log)))
      },
      (effect, { mnemonic }) => Effect.provide(effect, HostMnemonic.layer(mnemonic)),
    ),
  ),
)
