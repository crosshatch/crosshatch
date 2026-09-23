import { platform } from "node:process"

import { Effect, Data } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/unstable/process"

export class NoSuchBrowserOpenCommandError extends Data.TaggedError("NoSuchBrowserOpenCommandError") {}

export const open = Effect.fnUntraced(function* (url: string) {
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const command =
    platform === "darwin"
      ? ChildProcess.make("open", [url])
      : platform === "win32"
        ? ChildProcess.make("explorer.exe", [url])
        : ChildProcess.make("xdg-open", [url])
  yield* spawner.exitCode(command).pipe(
    Effect.catchReasons("PlatformError", {
      NotFound: () => new NoSuchBrowserOpenCommandError(),
    }),
  )
})
