import { Effect } from "effect"

export type Hash = "SHA-256" | "SHA-384" | "SHA-512"

export const digest = Effect.fnUntraced(function* (key: Uint8Array, data: Uint8Array, hash: Hash) {
  const cryptoKey = yield* Effect.promise(() =>
    crypto.subtle.importKey("raw", key.slice(), { name: "HMAC", hash }, false, ["sign"]),
  )
  return yield* Effect.promise(() => crypto.subtle.sign("HMAC", cryptoKey, data.slice())).pipe(
    Effect.map((v) => new Uint8Array(v)),
  )
})
