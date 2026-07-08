import { Redacted, Effect, Config, Context, Layer } from "effect"
import { Mnemonic as OxMnemonic } from "ox"
import { privateKeyToAccount } from "viem/accounts"

import * as Mnemonic from "../Mnemonic.ts"
import { EvmAddress } from "./EvmAddress.ts"

export class EvmSigner extends Context.Service<
  EvmSigner,
  {
    readonly address: typeof EvmAddress.Encoded

    readonly signTypedData: (message: {
      domain: Record<string, unknown>
      types: Record<string, unknown>
      primaryType: string
      message: Record<string, unknown>
    }) => Promise<typeof EvmAddress.Encoded>
  }
>()("crosshatch/Evm/EvmSigner") {}

export const layerMnemonic = (mnemonic: typeof Mnemonic.Mnemonic.Type) =>
  Layer.succeed(EvmSigner, privateKeyToAccount(OxMnemonic.toPrivateKey(Redacted.value(mnemonic), { as: "Hex" })))

export const layerMnemonicConfig = (mnemonicConfig: Config.Config<typeof Mnemonic.Mnemonic.Type>) =>
  mnemonicConfig.pipe(Effect.map(layerMnemonic), Layer.unwrap)

export const fromMnemonicEnv = Config.string("MNEMONIC").pipe(Config.map(Mnemonic.make), layerMnemonicConfig)
