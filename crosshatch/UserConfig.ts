import Os from "node:os"
import Path from "node:path"

import { Effect, FileSystem, Schema as S } from "effect"

import { Asymmetric } from "./Crypto/Envelope.ts"
import * as DerivedAddresses from "./Unified/DerivedAddresses.ts"

export type UserConfig = typeof UserConfig.Type
export const UserConfig = S.Struct({
  mnemonics: S.Record(
    S.String,
    S.Struct({
      addresses: DerivedAddresses.DerivedAddresses,
      mnemonic: Asymmetric,
      dateAdded: S.optionalKey(S.DateFromString),
      description: S.optionalKey(S.String),
    }),
  ),
})

const configDir = Path.join(Os.homedir(), ".config/crosshatch")
const configPath = Path.join(configDir, "crosshatch.json")

export const get = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  return yield* fs.readFileString(configPath).pipe(
    Effect.flatMap(S.decodeUnknownEffect(S.fromJsonString(S.toCodecJson(UserConfig)))),
    Effect.catchIf(
      (error) => error._tag === "PlatformError" && error.reason._tag === "NotFound",
      () => Effect.succeed(undefined),
    ),
  )
})

export const set = Effect.fn(function* (config: UserConfig) {
  const contents = yield* S.encodeEffect(S.toCodecJson(UserConfig))(config).pipe(
    Effect.map((v) => JSON.stringify(v, null, 2)),
  )
  const fs = yield* FileSystem.FileSystem
  yield* fs.makeDirectory(configDir, { recursive: true })
  const temporary = `${configPath}.tmp`
  yield* fs.writeFileString(temporary, contents)
  yield* fs.rename(temporary, configPath)
})

export const update = Effect.fn(function* (f: (config: UserConfig) => UserConfig) {
  const config = (yield* get) ?? { mnemonics: {} }
  const updated = f(config)
  yield* set(updated)
  return updated
})
