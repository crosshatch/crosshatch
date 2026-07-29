import { Context, Effect, Data } from "effect"

import * as Mnemonic from "./Mnemonic.ts"
import { MnemonicEntry } from "./UserConfig.ts"

export class NoSuchMnemonicError extends Data.TaggedError("NoSuchMnemonicError")<{ readonly name: string }> {
  override get message() {
    return `Mnemonic "${this.name}" was not found.`
  }
}

export class NameAlreadyTakenError extends Data.TaggedError("NameAlreadyTakenError")<{ readonly name: string }> {
  override get message() {
    return `A mnemonic with the name "${this.name}" already exists.`
  }
}

export class MnemonicListError extends Data.TaggedError("MnemonicListError")<{ readonly cause?: unknown }> {}

export class MnemonicAddError extends Data.TaggedError("MnemonicAddError")<{ readonly cause?: unknown }> {}

export class MnemonicGetError extends Data.TaggedError("MnemonicGetError")<{ readonly cause?: unknown }> {}

export class MnemonicDescribeError extends Data.TaggedError("MnemonicDescribeError")<{ readonly cause?: unknown }> {}

export class MnemonicRemoveError extends Data.TaggedError("MnemonicRemoveError")<{ readonly cause?: unknown }> {}

export class MnemonicRenameError extends Data.TaggedError("MnemonicRenameError")<{ readonly cause?: unknown }> {}

export class MnemonicStore extends Context.Service<
  MnemonicStore,
  {
    readonly list: Effect.Effect<Record<string, MnemonicEntry>, MnemonicListError>

    readonly add: (config: {
      readonly name: string
      readonly description?: string | undefined
      readonly mnemonic: Mnemonic.Mnemonic
    }) => Effect.Effect<void, MnemonicAddError>

    readonly get: (name: string) => Effect.Effect<Mnemonic.Mnemonic, MnemonicGetError>

    readonly describe: (name: string, description: string | undefined) => Effect.Effect<void, MnemonicDescribeError>

    readonly remove: (name: string) => Effect.Effect<void, MnemonicRemoveError>

    readonly rename: (from: string, to: string) => Effect.Effect<undefined, MnemonicRenameError>
  }
>()("crosshatch/MnemonicStore") {}
