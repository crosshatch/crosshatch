import { Redacted, Context, Layer } from "effect"
import { Mnemonic as OxMnemonic } from "ox"
import { privateKeyToAccount, type CustomSource } from "viem/accounts"

import * as Mnemonic from "../Mnemonic.ts"

export class Eip155Signer extends Context.Service<Eip155Signer, CustomSource>()("crosshatch/Eip155/Eip155Signer") {}

export const layerMnemonic = (mnemonic: typeof Mnemonic.Mnemonic.Type) =>
  Layer.succeed(Eip155Signer, privateKeyToAccount(OxMnemonic.toPrivateKey(Redacted.value(mnemonic), { as: "Hex" })))
