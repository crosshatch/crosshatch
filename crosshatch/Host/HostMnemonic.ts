import { Layer } from "effect"

import { Mnemonic } from "../Mnemonic.ts"
import { get } from "./MnemonicStore.ts"

export const layer = (name?: string) => Layer.effect(Mnemonic, get(name ?? "default"))
