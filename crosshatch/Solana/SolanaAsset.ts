import { Asset } from "../index.ts"
import { SolanaAddress } from "./SolanaAddress.ts"

export type SolanaAsset = typeof SolanaAsset.Type
export const SolanaAsset = SolanaAddress.pipe(Asset.brand)
