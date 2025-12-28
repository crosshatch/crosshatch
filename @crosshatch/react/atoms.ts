import { LoggerLive } from "@crosshatch/util"
import { Atom, Result } from "@effect-atom/atom-react"
import { WorkerError } from "@effect/platform"
import type { SessionDetails } from "crosshatch"
import { Cause } from "effect"
import { Layer } from "effect"
import { EnclaveClient } from "./EnclaveClient.ts"

export const sessionDetailsAtom: Atom.Atom<
  Result.Result<
    SessionDetails,
    WorkerError.WorkerError | Cause.NoSuchElementException
  >
> = EnclaveClient.query("sessionDetails", void 0)

export const unlinkAtom = EnclaveClient.mutation("revoke")

export const runtime = Atom.runtime(Layer.mergeAll(
  LoggerLive,
  EnclaveClient.layer,
))
