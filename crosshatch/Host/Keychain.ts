import { Entry } from "@napi-rs/keyring"
import { Data, Effect } from "effect"

import * as PrintableError from "../PrintableError.ts"

export type KeychainOperation = "read" | "write" | "remove"

export class KeychainError extends PrintableError.make(
  Data.TaggedError("MnemonicKeychainError")<{
    readonly operation: KeychainOperation
    readonly name: string
    readonly cause: unknown
  }>,
  ({ operation, name }) => `Could not ${operation} the keychain secret for "${name}".`,
) {}

const f = <A>(name: string, operation: KeychainOperation, evaluate: (entry: Entry) => A) =>
  Effect.try({
    try: () => evaluate(new Entry("crosshatch", name)),
    catch: (cause) => new KeychainError({ name, operation, cause }),
  })

export const get = Effect.fn(function* (name: string) {
  const secret = yield* f(name, "read", (entry) => entry.getSecret())
  return secret ? new Uint8Array(secret) : undefined
})

export const set = (name: string, secret: Uint8Array) => f(name, "write", (entry) => entry.setSecret(secret))

export const remove = (name: string) => f(name, "remove", (entry) => entry.deleteCredential())
