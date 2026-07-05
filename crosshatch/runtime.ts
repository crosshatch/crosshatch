import { ManagedRuntime, Layer } from "effect"

export const runtime = ManagedRuntime.make(Layer.empty)
