import { LoggerLive } from "@crosshatch/util"
import { Atom } from "@effect-atom/atom-react"
import { Layer } from "effect"
import { EnclaveClient } from "./EnclaveClient.ts"

export const installationAtom = EnclaveClient.query("link", void 0)

export const unlinkAtom = EnclaveClient.mutation("unlink")

export const runtime = Atom.runtime(Layer.mergeAll(
  LoggerLive,
  EnclaveClient.layer,
))
