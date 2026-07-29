import * as Os from "node:os"

import { Layer, Effect, FileSystem, Schema as S, Path } from "effect"

import {
  GetUserConfigError,
  SetUserConfigError,
  UserConfig,
  UserConfigJson,
  UserConfigJsonString,
} from "../UserConfig.ts"

export const layer = Layer.effect(
  UserConfig,
  Effect.gen(function* () {
    const path = yield* Path.Path
    const fs = yield* FileSystem.FileSystem
    const configDir = path.join(Os.homedir(), ".config/crosshatch")
    const configPath = path.join(configDir, "crosshatch.json")

    const get = fs.readFileString(configPath).pipe(
      Effect.flatMap(S.decodeUnknownEffect(UserConfigJsonString)),
      Effect.catchReasons("PlatformError", {
        NotFound: () => Effect.undefined,
      }),
      Effect.mapError((cause) => new GetUserConfigError({ cause })),
    )

    const set = Effect.fn(
      function* (config: UserConfig) {
        const contents = yield* S.encodeEffect(UserConfigJson)(config).pipe(
          Effect.map((v) => JSON.stringify(v, null, 2)),
        )
        yield* fs.makeDirectory(configDir, { recursive: true })
        const temporary = `${configPath}.tmp`
        yield* fs.writeFileString(temporary, contents)
        yield* fs.rename(temporary, configPath)
      },
      Effect.mapError((cause) => new SetUserConfigError({ cause })),
    )

    const update = Effect.fn(function* (f: (config: UserConfig) => UserConfig) {
      const config = (yield* get) ?? { mnemonics: {} }
      const updated = f(config)
      yield* set(updated)
      return updated
    })

    return { get, set, update }
  }),
)
