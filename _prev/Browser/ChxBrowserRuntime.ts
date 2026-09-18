import { ManagedRuntime, Layer } from "effect"

import * as ChxBrowserServices from "./ChxBrowserServices.ts"

export const memoMap = Layer.makeMemoMapUnsafe()

export const ChxBrowserRuntime = ManagedRuntime.make(ChxBrowserServices.layer, { memoMap })
