import { Context, Data, type Effect } from "effect"

export type KeychainOperation = "read" | "write" | "remove"

export class KeychainError extends Data.TaggedError("MnemonicKeychainError")<{
  readonly operation: KeychainOperation
  readonly name: string
  readonly cause: unknown
}> {
  override get message() {
    return `Could not ${this.operation} the keychain secret for "${this.name}".`
  }
}

export class Keychain extends Context.Service<
  Keychain,
  {
    readonly set: (name: string, secret: Uint8Array) => Effect.Effect<void, KeychainError>
    readonly get: (name: string) => Effect.Effect<Uint8Array<ArrayBuffer> | undefined, KeychainError>
    readonly remove: (name: string) => Effect.Effect<boolean, KeychainError>
  }
>()("crosshatch/Keychain") {}
