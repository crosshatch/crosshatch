import { Console, Effect } from "effect"
import { Command } from "effect/unstable/cli"

import * as UserConfig from "./UserConfig.ts"

export const profileList = Command.make("list").pipe(
  Command.withHandler(
    Effect.fn(function* () {
      const config = yield* UserConfig.read
      yield* Console.table(
        Object.entries(config?.profiles ?? {}).map(([profile, { address, dateAdded, description }]) => ({
          profile,
          address,
          dateAdded: dateAdded?.toISOString() ?? "",
          description: description ?? "",
        })),
      )
    }),
  ),
)
