import { Address, Asset } from "../index.ts"
import { brand } from "./_common.ts"
import { Eip155Address } from "./Eip155Address.ts"

export type Eip155Asset = typeof Eip155Asset.Type
export const Eip155Asset = Eip155Address.pipe(Address.brand, Asset.brand, brand)
