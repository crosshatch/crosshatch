import { Instrument, Select, Payer, Mnemonic } from "crosshatch"
import { USDC } from "crosshatch/coins"
import { Eip155Signer, Erc3009Scheme, Permit2Scheme } from "crosshatch/namespaces/Eip155"
import { Layer } from "effect"

const select = Select.fromPredicate(Instrument.matchRequirements([USDC]))

export const layerPayer = Payer.layer(select).pipe(
  Layer.provide(
    Layer.mergeAll(Erc3009Scheme.layer, Permit2Scheme.layer).pipe(
      Layer.provide(Eip155Signer.layerFromMnemonic.pipe(Layer.provide(Mnemonic.layerFromConfig("MNEMONIC")))),
    ),
  ),
)
