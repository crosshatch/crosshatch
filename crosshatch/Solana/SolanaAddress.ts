import { Effect, flow, Redacted, Schema as S } from "effect"
import { Base58, Mnemonic as OxMnemonic } from "ox"

import * as Address from "../Address.ts"
import { Ed25519Pair, Slip10, CryptoKey } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { brand } from "./_common.ts"

export const SolanaAddress = S.String.check(S.isPattern(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/u)).pipe(Address.brand, brand)

export const fromMnemonic = (
  mnemonic: Mnemonic.Mnemonic,
): Effect.Effect<typeof SolanaAddress.Type, S.SchemaError, never> =>
  Slip10.derive(OxMnemonic.toSeed(Redacted.value(mnemonic)), [44, 501, 0, 0]).pipe(
    Effect.flatMap(({ privateKeySeed }) => Ed25519Pair.fromSeed(privateKeySeed)),
    Effect.flatMap(({ publicKey }) => CryptoKey.toBytes(publicKey)),
    Effect.map(flow(Base58.fromBytes, (v) => SolanaAddress.make(v))),
  )
