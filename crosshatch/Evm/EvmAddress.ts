import { Config, flow, Redacted, Schema as S } from "effect"
import { Address as OxAddress, HdKey, Secp256k1, Mnemonic as OxMnemonic } from "ox"

import * as Mnemonic from "../Mnemonic.ts"

/** EVM account address — `0x` followed by 20 bytes of hex. */
export const EvmAddress = S.TemplateLiteral([S.Literal("0x"), S.String])
  .check(S.isPattern(/^0x[a-fA-F0-9]{40}$/))
  .pipe(S.brand("crosshatch/Address"), S.brand("crosshatch/EvmAddress"))

export const config = flow(Config.string, Config.map(S.decodeUnknownSync(EvmAddress)))

export const toAddress = (mnemonic: typeof Mnemonic.MnemonicRedacted.Type): typeof EvmAddress.Type => {
  const seed = OxMnemonic.toSeed(Redacted.value(mnemonic))
  const root = HdKey.fromSeed(seed)
  const { privateKey } = root.derive("m/44'/60'/0'/0/0")
  const publicKey = Secp256k1.getPublicKey({ privateKey })
  return EvmAddress.make(OxAddress.fromPublicKey(publicKey))
}
