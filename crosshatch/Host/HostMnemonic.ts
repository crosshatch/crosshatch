import { NodeFileSystem } from "@effect/platform-node"
import { Layer } from "effect"

import { Mnemonic } from "../Mnemonic.ts"
import { get } from "./MnemonicStore.ts"

export const layer = (name?: string) =>
  Layer.effect(Mnemonic, get(name ?? "default")).pipe(Layer.provide(NodeFileSystem.layer))
