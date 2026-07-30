import { Layer } from "effect"

import * as NodeKeychain from "./NodeKeychain.ts"
import * as NodeMnemonicStore from "./NodeMnemonicStore.ts"
import * as NodeUserConfig from "./NodeUserConfig.ts"

export const layer = NodeMnemonicStore.layer.pipe(Layer.provideMerge([NodeUserConfig.layer, NodeKeychain.layer]))
