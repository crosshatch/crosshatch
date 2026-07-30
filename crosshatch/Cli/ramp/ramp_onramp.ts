import { openBrowser } from "@crosshatch/widget/openBrowser"
import { Effect, flow, Schema as S, Struct } from "effect"
import { Command, Flag } from "effect/unstable/cli"

import * as Amount from "../../Amount.ts"
import { Eip155Address } from "../../Eip155/Eip155.ts"
import { HostMnemonic } from "../../Host/Host.ts"
import * as Mnemonic from "../../Mnemonic.ts"
import { CaAccountId, Providers, RampClient } from "../../Ramp/Ramp.ts"
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
      function* ({ amount, chain, provider }) {
        const chainRef = chain === undefined ? Reference.make("8453") : yield* S.decodeUnknownEffect(Reference)(chain)
        const mnemonic = yield* Mnemonic.Mnemonic
        const address = yield* Eip155Address.fromMnemonic(mnemonic)
        const ramp = yield* RampClient
        const recipient = CaAccountId.CaAccountId.make(`eip155:${chainRef}:${address}`, { disableChecks: true })
        yield* ramp
          .onramp({
            payload: {
              provider,
              amount: yield* Amount.from(amount),
              recipient,
            },
          })
          .pipe(Effect.flatMap(flow(Struct.get("onrampUrl"), openBrowser)))
      },
      (effect, { mnemonic }) => Effect.provide(effect, HostMnemonic.layer(mnemonic)),
    ),
  ),
)
