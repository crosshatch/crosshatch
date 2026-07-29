import { Context, Data, Effect } from "effect"

import * as Mnemonic from "./Mnemonic.ts"
import * as PrintableError from "./PrintableError.ts"
import { MnemonicEntry } from "./UserConfig.ts"

export class NoSuchMnemonicError extends PrintableError.make(
  Data.TaggedError("MnemonicNotFoundError")<{ readonly name: string }>,
  ({ name }) => `Mnemonic "${name}" was not found.`,
) {}

export class NameAlreadyTakenError extends PrintableError.make(
  Data.TaggedError("NameAlreadyTakenError")<{ readonly name: string }>,
  ({ name }) => `A mnemonic with the name "${name}" already exists.`,
) {}

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
    }) => Effect.Effect<void, NameAlreadyTakenError | MnemonicAddError>
    readonly get: (name: string) => Effect.Effect<Mnemonic.Mnemonic, NoSuchMnemonicError | MnemonicGetError>
    readonly describe: (
      name: string,
      description: string | undefined,
    ) => Effect.Effect<void, NoSuchMnemonicError | MnemonicDescribeError>
    readonly remove: (name: string) => Effect.Effect<void, NoSuchMnemonicError | MnemonicRemoveError>
    readonly rename: (
      from: string,
      to: string,
    ) => Effect.Effect<undefined, NoSuchMnemonicError | NameAlreadyTakenError | MnemonicRenameError>
  }
>()("crosshatch/Host/MnemonicStore") {}
