import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"

import { CryptoKey, Ed25519Pair, Ed25519PrivateKey, X25519Pair, X25519PrivateKey, X25519PublicKey } from "./Crypto.ts"

describe(import.meta.url, () => {
  it.effect(
    "encrypting and decrypting",
    Effect.fn(function* () {
      const { privateKey, publicKey } = yield* X25519Pair.random()
      const data = new TextEncoder().encode("crosshatching")
      const cva = yield* X25519PublicKey.encrypt(publicKey, data)
      const decrypted = yield* X25519PrivateKey.decrypt(privateKey, cva)
      expect(decrypted).toStrictEqual(data)
    }),
  )
  it.effect(
    "X25519 wrong-key decrypt failure",
    Effect.fn(function* () {
      const pairA = yield* X25519Pair.random()
      const pairB = yield* X25519Pair.random()
      const data = new TextEncoder().encode("crosshatching")
      const envelope = yield* X25519PublicKey.encrypt(pairA.publicKey, data)
      const exit = yield* X25519PrivateKey.decrypt(pairB.privateKey, envelope).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "private key serialization roundtrip",
    Effect.fn(function* () {
      const { privateKey, publicKey } = yield* X25519Pair.random({ extractable: true })
      const pkcs8 = yield* X25519PrivateKey.toPkcs8(privateKey)
      const hydrated = yield* X25519PrivateKey.fromPkcs8(pkcs8)
      const data = new TextEncoder().encode("crosshatching")
      const envelope = yield* X25519PublicKey.encrypt(publicKey, data)
      const decrypted = yield* X25519PrivateKey.decrypt(hydrated, envelope)
      expect(decrypted).toStrictEqual(data)
    }),
  )
  it.effect(
    "non-extractable private key export fails",
    Effect.fn(function* () {
      const { privateKey } = yield* X25519Pair.random()
      const exit = yield* X25519PrivateKey.toPkcs8(privateKey).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "rejects malformed PKCS#8 private key bytes",
    Effect.fn(function* () {
      const malformedPkcs8 = new Uint8Array([1, 2, 3, 4])
      const exit = yield* X25519PrivateKey.fromPkcs8(malformedPkcs8).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "rejects Ed25519 PKCS#8 private key bytes",
    Effect.fn(function* () {
      const { privateKey } = yield* Ed25519Pair.random({ extractable: true })
      const pkcs8 = yield* Ed25519PrivateKey.toPkcs8(privateKey)
      const exit = yield* X25519PrivateKey.fromPkcs8(pkcs8).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "imports PKCS#8 private keys as non-extractable",
    Effect.fn(function* () {
      const { privateKey } = yield* X25519Pair.random({ extractable: true })
      const pkcs8 = yield* X25519PrivateKey.toPkcs8(privateKey)
      const hydrated = yield* X25519PrivateKey.fromPkcs8(pkcs8)
      const exit = yield* X25519PrivateKey.toPkcs8(hydrated).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "public key serialization roundtrip",
    Effect.fn(function* () {
      const { publicKey } = yield* X25519Pair.random({ extractable: true })
      const raw = yield* CryptoKey.toBytes(publicKey)
      const hydrated = yield* X25519PublicKey.fromBytes(raw)
      const raw2 = yield* CryptoKey.toBytes(hydrated)
      expect(raw).toStrictEqual(raw2)
    }),
  )
})
