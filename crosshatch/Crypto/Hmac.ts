import { Effect } from "effect"

export type Hash = "SHA-256" | "SHA-384" | "SHA-512"

export const digest = (key: Uint8Array, data: Uint8Array, hash: Hash) =>
  Effect.promise(() => crypto.subtle.importKey("raw", key.slice(), { name: "HMAC", hash }, false, ["sign"])).pipe(
    Effect.flatMap((v) => Effect.promise(() => crypto.subtle.sign("HMAC", v, data.slice()))),
    Effect.map((v) => new Uint8Array(v)),
  )
