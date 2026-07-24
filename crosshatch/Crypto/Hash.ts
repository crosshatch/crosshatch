import { Effect } from "effect"

export type Hash = "SHA-256" | "SHA-384" | "SHA-512"

export const digest = (data: Uint8Array, hash: Hash) =>
  Effect.promise(() => crypto.subtle.digest(hash, data.slice())).pipe(Effect.map((v) => new Uint8Array(v)))

export const sha256 = (data: Uint8Array) => digest(data, "SHA-256")
