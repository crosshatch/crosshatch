import { Redacted, Effect, Config, Context, Layer, flow } from "effect"
import { Mnemonic as OxMnemonic } from "ox"
import { privateKeyToAccount } from "viem/accounts"

import { Adapter } from "../Adapter.ts"
import * as Mnemonic from "../Mnemonic.ts"
import * as Erc3009Payload from "./Erc3009Payload.ts"
import type { EvmSigner } from "./EvmSigner.ts"
import * as Permit2Payload from "./Permit2Payload.ts"

export class EvmAdapter extends Context.Service<EvmAdapter, Adapter>()("crosshatch/Evm/EvmAdapter") {}

export const layerSigner = (signer: EvmSigner): Layer.Layer<Adapter> =>
  Layer.succeed(
    Adapter,
    Effect.fnUntraced(function* ({ accepted }) {
      const method = accepted.extra?.assetTransferMethod ?? "eip3009"
      return yield* (method === "permit2" ? Permit2Payload.make : Erc3009Payload.make)(signer, accepted)
    }),
  )

export const layerMnemonic = (mnemonic: typeof Mnemonic.Mnemonic.Type) =>
  layerSigner(privateKeyToAccount(OxMnemonic.toPrivateKey(Redacted.value(mnemonic), { as: "Hex" })))

export const fromMnemonicConfig = (mnemonicConfig: Config.Config<typeof Mnemonic.Mnemonic.Type>) =>
  mnemonicConfig.pipe(Effect.map(layerMnemonic), Layer.unwrap)

export const layerMnemonicEnv = Config.string("MNEMONIC").pipe(
  Config.map(flow(Mnemonic.MnemonicText.make, Redacted.make)),
  Effect.map(layerMnemonic),
  Layer.unwrap,
)
