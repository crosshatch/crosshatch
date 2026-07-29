import { Context, Effect, Schema as S, Data } from "effect"

import { Asymmetric } from "./Crypto/Envelope.ts"
import * as DerivedAddresses from "./Unified/DerivedAddresses.ts"

export type MnemonicEntry = typeof MnemonicEntry.Type
export const MnemonicEntry = S.Struct({
  addresses: DerivedAddresses.DerivedAddresses,
  mnemonic: Asymmetric,
  dateAdded: S.optionalKey(S.DateFromString),
  description: S.optionalKey(S.String),
})

export interface UserConfig {
  readonly mnemonics: Record<string, MnemonicEntry>
}

export class GetUserConfigError extends Data.TaggedError("GetUserConfigError")<{ readonly cause?: unknown }> {}

export class SetUserConfigError extends Data.TaggedError("SetUserConfigError")<{ readonly cause?: unknown }> {}

export const UserConfig = Object.assign(
  Context.Service<
    UserConfig,
    {
      readonly get: Effect.Effect<UserConfig | undefined, GetUserConfigError>
      readonly set: (config: UserConfig) => Effect.Effect<void, SetUserConfigError>
      readonly update: (
        setter: (config: UserConfig) => UserConfig,
      ) => Effect.Effect<void, GetUserConfigError | SetUserConfigError>
    }
  >()("crosshatch/UserConfig"),
  S.Struct({
    mnemonics: S.Record(S.String, MnemonicEntry),
  }),
)

export const UserConfigJson = S.toCodecJson(UserConfig)
export const UserConfigJsonString = S.fromJsonString(UserConfigJson)
