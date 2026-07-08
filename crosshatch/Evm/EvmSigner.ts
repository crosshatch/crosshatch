import { Redacted, Effect, Config, Context, Layer } from "effect"
import { Mnemonic as OxMnemonic } from "ox"
import { privateKeyToAccount, type CustomSource } from "viem/accounts"

import * as Mnemonic from "../Mnemonic.ts"

export class EvmSigner extends Context.Service<EvmSigner, CustomSource>()("crosshatch/Evm/EvmSigner") {}

export const layerMnemonic = (mnemonic: typeof Mnemonic.Mnemonic.Type) =>
  Layer.succeed(EvmSigner, privateKeyToAccount(OxMnemonic.toPrivateKey(Redacted.value(mnemonic), { as: "Hex" })))

export const layerMnemonicConfig = (mnemonicConfig: Config.Config<typeof Mnemonic.Mnemonic.Type>) =>
  mnemonicConfig.pipe(Effect.map(layerMnemonic), Layer.unwrap)

export const layerMnemonicEnv = Config.string("MNEMONIC").pipe(Config.map(Mnemonic.make), layerMnemonicConfig)
