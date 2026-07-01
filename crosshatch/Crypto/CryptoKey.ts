import { Effect, flow, Schema as S, Encoding } from "effect"

export const toBytes = (key: CryptoKey) =>
  Effect.promise(() => crypto.subtle.exportKey("raw", key)).pipe(Effect.map((v) => new Uint8Array(v)))

export const encodeHex = flow(toBytes, Effect.map(Encoding.encodeHex))

export const CryptoKey = S.instanceOf(globalThis.CryptoKey).annotate({ identifier: "CryptoKey" })
