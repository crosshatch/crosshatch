import { describe, expect, it } from "@effect/vitest"
import { Effect, Exit } from "effect"

import { CryptoKey, Ed25519Pair, Ed25519PrivateKey, Ed25519PublicKey, X25519Pair, X25519PrivateKey } from "./Crypto.ts"

describe(import.meta.url, () => {
  it.effect(
    "signing and verifying",
    Effect.fn(function* () {
      const { privateKey, publicKey } = yield* Ed25519Pair.random()
      const data = new TextEncoder().encode("crosshatching")
      const signature = yield* Ed25519PrivateKey.sign(privateKey, data)
      const verification = yield* Ed25519PublicKey.verify(publicKey, signature, data)
      expect(verification).toBeTruthy()
    }),
  )
  it.effect(
    "does not verify signatures for a different message or public key",
    Effect.fn(function* () {
      const pairA = yield* Ed25519Pair.random()
      const pairB = yield* Ed25519Pair.random()
      const dataA = new TextEncoder().encode("crosshatching")
      const dataB = new TextEncoder().encode("not crosshatching")
      const signature = yield* Ed25519PrivateKey.sign(pairA.privateKey, dataA)
      const differentMessageVerification = yield* Ed25519PublicKey.verify(pairA.publicKey, signature, dataB)
      expect(differentMessageVerification).toBeFalsy()
      const differentKeyVerification = yield* Ed25519PublicKey.verify(pairB.publicKey, signature, dataA)
      expect(differentKeyVerification).toBeFalsy()
    }),
  )
  it.effect(
    "public key serialization roundtrip",
    Effect.fn(function* () {
      const { publicKey } = yield* Ed25519Pair.random()
      const raw = yield* CryptoKey.toBytes(publicKey)
      const hydrated = yield* Ed25519PublicKey.fromBytes(raw)
      const raw2 = yield* CryptoKey.toBytes(hydrated)
      expect(raw).toStrictEqual(raw2)
    }),
  )
  it.effect(
    "private key serialization roundtrip",
    Effect.fn(function* () {
      const { privateKey, publicKey } = yield* Ed25519Pair.random({ extractable: true })
      const pkcs8 = yield* Ed25519PrivateKey.toPkcs8(privateKey)
      const hydrated = yield* Ed25519PrivateKey.fromPkcs8(pkcs8)
      const data = new TextEncoder().encode("crosshatching")
      const signature = yield* Ed25519PrivateKey.sign(hydrated, data)
      const verification = yield* Ed25519PublicKey.verify(publicKey, signature, data)
      expect(verification).toBeTruthy()
    }),
  )
  it.effect(
    "non-extractable private key export fails",
    Effect.fn(function* () {
      const { privateKey } = yield* Ed25519Pair.random()
      const exit = yield* Ed25519PrivateKey.toPkcs8(privateKey).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "rejects malformed PKCS#8 private key bytes",
    Effect.fn(function* () {
      const malformedPkcs8 = new Uint8Array([1, 2, 3, 4])
      const exit = yield* Ed25519PrivateKey.fromPkcs8(malformedPkcs8).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "rejects X25519 PKCS#8 private key bytes",
    Effect.fn(function* () {
      const { privateKey } = yield* X25519Pair.random({ extractable: true })
      const pkcs8 = yield* X25519PrivateKey.toPkcs8(privateKey)
      const exit = yield* Ed25519PrivateKey.fromPkcs8(pkcs8).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "imports PKCS#8 private keys as non-extractable",
    Effect.fn(function* () {
      const { privateKey } = yield* Ed25519Pair.random({ extractable: true })
      const pkcs8 = yield* Ed25519PrivateKey.toPkcs8(privateKey)
      const hydrated = yield* Ed25519PrivateKey.fromPkcs8(pkcs8)
      const exit = yield* Ed25519PrivateKey.toPkcs8(hydrated).pipe(Effect.exit)
      expect(Exit.isFailure(exit)).toBeTruthy()
    }),
  )
  it.effect(
    "seed-derived extractable private key PKCS#8 lifecycle",
    Effect.fn(function* () {
      const seed = new Uint8Array(32).map((_, i) => i)
      const pair = yield* Ed25519Pair.fromSeed(seed)
      const privateKey = yield* Ed25519PrivateKey.fromSeed(seed, { extractable: true })
      const pkcs8 = yield* Ed25519PrivateKey.toPkcs8(privateKey)
      const hydrated = yield* Ed25519PrivateKey.fromPkcs8(pkcs8)
      const data = new TextEncoder().encode("crosshatching")
      const signature = yield* Ed25519PrivateKey.sign(hydrated, data)
      const verification = yield* Ed25519PublicKey.verify(pair.publicKey, signature, data)
      expect(verification).toBeTruthy()
    }),
  )
  it.effect(
    "deterministically derives from a seed",
    Effect.fn(function* () {
      const seed = new Uint8Array(32).map((_, i) => i)
      const pair1 = yield* Ed25519Pair.fromSeed(seed)
      const pair2 = yield* Ed25519Pair.fromSeed(seed)
      const publicKeyBytes1 = yield* CryptoKey.toBytes(pair1.publicKey)
      const publicKeyBytes2 = yield* CryptoKey.toBytes(pair2.publicKey)
      expect(publicKeyBytes1).toStrictEqual(publicKeyBytes2)
      const data = new TextEncoder().encode("crosshatching")
      const signature = yield* Ed25519PrivateKey.sign(pair1.privateKey, data)
      const verification = yield* Ed25519PublicKey.verify(pair2.publicKey, signature, data)
      expect(verification).toBeTruthy()
    }),
  )
})
