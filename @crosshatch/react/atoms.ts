import { LoggerLive } from "@crosshatch/util"
import { Atom, Result } from "@effect-atom/atom-react"
import type { WorkerError } from "@effect/platform"
import { models } from "crosshatch"
import { Cause, Layer } from "effect"
import { EnclaveClient } from "./EnclaveClient.ts"

export const installationAtom: Atom.Atom<
  Result.Result<
    models.InstallationInfo,
    WorkerError.WorkerError | Cause.NoSuchElementException
  >
> = EnclaveClient.query("installationInfo", void 0)

export const rotateAtom = EnclaveClient.mutation("rotate")

export const runtime = Atom.runtime(Layer.mergeAll(
  LoggerLive,
  EnclaveClient.layer,
))
