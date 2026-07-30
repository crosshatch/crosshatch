import { Context, type Effect, Schema as S, Data } from "effect"

import { Envelope } from "./Crypto/Crypto.ts"
import { DerivedAddresses } from "./Unified/Unified.ts"

export type MnemonicConfig = typeof MnemonicConfig.Type
export const MnemonicConfig = S.Struct({
  addresses: DerivedAddresses.DerivedAddresses,
  envelope: Envelope.Asymmetric,
  dateAdded: S.DateFromString.pipe(S.optional),
  description: S.String.pipe(S.optional),
})

export type MnemonicConfigs = typeof MnemonicConfigs.Type
export const MnemonicConfigs = S.Record(S.String, MnemonicConfig)

export class GetUserConfigError extends Data.TaggedError("GetUserConfigError")<{ readonly cause?: unknown }> {}

export class SetUserConfigError extends Data.TaggedError("SetUserConfigError")<{ readonly cause?: unknown }> {}

export interface UserConfig {
  readonly mnemonics: MnemonicConfigs
}

export const UserConfig = Object.assign(
  Context.Service<
    UserConfig,
    {
      readonly get: Effect.Effect<UserConfig, GetUserConfigError>
      readonly set: (config: UserConfig) => Effect.Effect<void, SetUserConfigError>
      readonly update: (
        setter: (config: UserConfig) => UserConfig,
      ) => Effect.Effect<void, GetUserConfigError | SetUserConfigError>
    }
  >()("crosshatch/UserConfig"),
  S.Struct({
    mnemonics: S.Record(S.String, MnemonicConfig),
  }),
)

export const UserConfigJson = S.toCodecJson(UserConfig)
export const UserConfigJsonString = S.fromJsonString(UserConfigJson)
