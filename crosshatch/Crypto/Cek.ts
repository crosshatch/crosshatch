import { Effect, Ref, Schema as S, Context, Layer, Data } from "effect"

import * as CryptoKey from "./CryptoKey.ts"
import type * as Envelope from "./Envelope.ts"
import * as Random from "./Random.ts"
import * as X25519Pair from "./X25519Pair.ts"
import * as X25519PrivateKey from "./X25519PrivateKey.ts"

const AES_GCM = "AES-GCM"
const AES_KEY_BITS = 256
const GCM_TAG_BITS = 128

type Cek_ = typeof Cek_.Type
const Cek_ = CryptoKey.CryptoKey.pipe(S.brand("crosshatch/Crypto/Cek"))

// oxlint-disable-next-line typescript/no-empty-interface
export interface Cek extends Cek_ {}

export const Cek = Object.assign(Context.Service<Cek, Ref.Ref<Cek | undefined>>()("crosshatch/Crypto/Cek"), Cek_)

export const value = Cek.pipe(Effect.flatMap(Ref.get))

export const set = (value: Cek | undefined) => Cek.pipe(Effect.flatMap(Ref.set(value)))

export const layer = Layer.effect(Cek, Ref.make<Cek | undefined>(undefined))

export class HydrationError extends Data.TaggedClass("HydrationError") {}

export const hydrate = Effect.fnUntraced(function* (envelope: Envelope.Asymmetric) {
  const { privateKey } = yield* X25519Pair.X25519Pair.pipe(
    Effect.flatMap(Ref.get),
    Effect.filterOrFail(
      (v) => !!v,
      () => new HydrationError(),
    ),
  )
  const cekBytes = yield* X25519PrivateKey.decrypt(privateKey, envelope)
  const cek = yield* fromBytes(cekBytes)
  yield* set(cek)
})

export const fromBytes = (bytes: Uint8Array, config?: { readonly extractable?: boolean | undefined }) =>
  Effect.promise(() =>
    crypto.subtle.importKey("raw", bytes.slice(), { name: AES_GCM }, config?.extractable ?? false, [
      "encrypt",
      "decrypt",
    ]),
  ).pipe(Effect.map((v) => Cek.make(v, { disableChecks: true })))

export const toBytes = (cek: Cek) => CryptoKey.toBytes(cek)

export const random = (config?: { readonly extractable?: boolean | undefined }) =>
  Effect.sync(() => Random.bytes(32)).pipe(Effect.flatMap((v) => fromBytes(v, config)))

export const fromPrf = Effect.fnUntraced(function* (
  value: Uint8Array,
  config?: { readonly extractable?: boolean | undefined },
) {
  const baseKey = yield* Effect.promise(() =>
    crypto.subtle.importKey("raw", value.slice(), "HKDF", false, ["deriveKey"]),
  )
  return yield* Effect.promise(() =>
    crypto.subtle.deriveKey(
      {
        hash: "SHA-256",
        name: "HKDF",
        salt: new Uint8Array(),
      },
      baseKey,
      {
        length: AES_KEY_BITS,
        name: AES_GCM,
      },
      config?.extractable ?? false,
      ["encrypt", "decrypt"],
    ),
  ).pipe(Effect.map((v) => Cek.make(v, { disableChecks: true })))
})

export const encrypt = Effect.fnUntraced(function* (cek: Cek, value: Uint8Array) {
  const iv = Random.bytes(12)
  const cv = yield* Effect.promise(() =>
    crypto.subtle.encrypt(
      {
        iv,
        name: AES_GCM,
        tagLength: GCM_TAG_BITS,
      },
      cek,
      value.slice(),
    ),
  ).pipe(Effect.map((v) => new Uint8Array(v)))
  return { cv, iv }
})

export const decrypt = (cek: Cek, { cv, iv }: Envelope.Symmetric) =>
  Effect.promise(() =>
    crypto.subtle.decrypt(
      {
        iv: iv.slice(),
        name: AES_GCM,
        tagLength: GCM_TAG_BITS,
      },
      cek,
      cv.slice(),
    ),
  ).pipe(Effect.map((v) => new Uint8Array(v)))
