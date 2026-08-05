import { Entry } from "@napi-rs/keyring"
import { Effect, Layer } from "effect"

import { Keychain } from "../index.ts"

const f = <A>(name: string, operation: Keychain.KeychainOperation, evaluate: (entry: Entry) => A) =>
  Effect.try({
    try: () => evaluate(new Entry("crosshatch", name)),
    catch: (cause) => new Keychain.KeychainError({ name, operation, cause }),
  })

export const layer = Layer.succeed(Keychain.Keychain, {
  get: Effect.fnUntraced(function* (name: string) {
    const secret = yield* f(name, "read", (entry) => entry.getSecret())
    return secret ? new Uint8Array(secret) : undefined
  }),

  set: (name: string, secret: Uint8Array) => f(name, "write", (entry) => entry.setSecret(secret)),

  remove: (name: string) => f(name, "remove", (entry) => entry.deleteCredential()),
})
