import { LoggerLive } from "@crosshatch/util"
import { Atom, Result } from "@effect-atom/atom-react"
import type { WorkerError } from "@effect/platform"
import type { EnclaveLinkSuccess } from "crosshatch"
import { Cause, Layer } from "effect"
import { EnclaveClient } from "./EnclaveClient.ts"

export const linkStatusAtom: Atom.Atom<
  Result.Result<
    typeof EnclaveLinkSuccess.Type,
    WorkerError.WorkerError | Cause.NoSuchElementException
  >
> = EnclaveClient.query("link", void 0)

export const unlinkAtom = EnclaveClient.mutation("unlink")

export const runtime = Atom.runtime(Layer.mergeAll(
  LoggerLive,
  EnclaveClient.layer,
))
