import * as Os from "node:os"

import { Schema as S, FileSystem, Path, Effect } from "effect"

import { Address } from "../Address.ts"
import { Asymmetric } from "../Crypto/Envelope.ts"

export const UserConfig = S.Struct({
  profiles: S.Record(
    S.String,
    S.Struct({
      address: Address,
      mnemonic: Asymmetric,
    }).pipe(S.mutableKey),
  ),
})

export const configDir = Effect.gen(function* () {
  const path = yield* Path.Path
  return path.join(Os.homedir(), ".config/crosshatch")
})

export const configPath = Effect.gen(function* () {
  const path = yield* Path.Path
  return path.join(yield* configDir, "crosshatch.json")
})

export const read = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  return yield* fs.readFileString(yield* configPath).pipe(
    Effect.flatMap(S.decodeUnknownEffect(S.fromJsonString(S.toCodecJson(UserConfig)))),
    Effect.catchIf(
      (error) => error._tag === "PlatformError" && error.reason._tag === "NotFound",
      () => Effect.succeed(undefined),
    ),
  )
})

export const write = Effect.fn(function* (config: typeof UserConfig.Type) {
  const contents = yield* S.encodeEffect(S.toCodecJson(UserConfig))(config).pipe(
    Effect.map((v) => JSON.stringify(v, null, 2)),
  )
  const fs = yield* FileSystem.FileSystem
  yield* fs.makeDirectory(yield* configDir, { recursive: true })
  yield* fs.writeFileString(yield* configPath, contents)
})
