import { Atom, Result } from "@effect-atom/atom-react"
import { WorkerError } from "@effect/platform"
import type { SessionDetails } from "crosshatch"
import { Cause } from "effect"
import { EnclaveClient } from "./EnclaveClient.ts"

export const sessionDetailsAtom: Atom.Atom<
  Result.Result<
    SessionDetails,
    WorkerError.WorkerError | Cause.NoSuchElementException
  >
> = EnclaveClient.query("session", void 0)
