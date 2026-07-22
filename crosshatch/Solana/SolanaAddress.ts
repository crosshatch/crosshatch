import { Effect, Schema as S } from "effect"

import * as Address from "../Address.ts"
import { Ed25519Pair, Slip10 } from "../Crypto/Crypto.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { brand } from "./_common.ts"
import { addressFromPublicKey, Address as SolanaProtocolAddress, SvmProtocolError } from "./Protocol/Protocol.ts"

export const SolanaAddress = SolanaProtocolAddress.pipe(Address.brand, brand)

export const fromPublicKey = (publicKey: CryptoKey) =>
  addressFromPublicKey(publicKey).pipe(Effect.map((value) => SolanaAddress.make(value, { disableChecks: true })))

export const fromMnemonic = (
  mnemonic: Mnemonic.Mnemonic,
): Effect.Effect<typeof SolanaAddress.Type, S.SchemaError | SvmProtocolError, never> =>
  Slip10.derive(Mnemonic.toSeed(mnemonic), [44, 501, 0, 0]).pipe(
    Effect.flatMap(({ privateKeySeed }) => Ed25519Pair.fromSeed(privateKeySeed)),
    Effect.flatMap(({ publicKey }) => fromPublicKey(publicKey)),
  )
