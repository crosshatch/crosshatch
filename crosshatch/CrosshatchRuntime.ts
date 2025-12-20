import { ManagedRuntime } from "effect"
import { Live } from "./Live.ts"

export const CrosshatchRuntime = ManagedRuntime.make(Live)
