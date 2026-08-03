import { Context, type Effect, Schema as S, Data } from "effect"

import { Envelope } from "./Crypto/index.ts"
import { DerivedAddresses } from "./Unified/index.ts"

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

type UserConfig_ = typeof UserConfig_.Type
const UserConfig_ = S.Struct({
  mnemonics: S.Record(S.String, MnemonicConfig),
})

// oxlint-disable-next-line typescript/no-empty-interface
export interface UserConfig extends UserConfig_ {}

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
  UserConfig_,
)

export const UserConfigJson = S.toCodecJson(UserConfig)
export const UserConfigFromJsonString = S.fromJsonString(UserConfigJson)
