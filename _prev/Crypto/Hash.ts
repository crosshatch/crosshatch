import { Effect, Function } from "effect"

export type Hash = "SHA-256" | "SHA-384" | "SHA-512"

export const digest = Function.dual<
  (hash: Hash) => (data: ArrayBuffer) => Effect.Effect<Uint8Array>,
  (data: ArrayBuffer, hash: Hash) => Effect.Effect<Uint8Array>
>(2, (data: ArrayBuffer, hash: Hash) =>
  Effect.promise(() => crypto.subtle.digest(hash, data.slice())).pipe(Effect.map((v) => new Uint8Array(v))),
)
