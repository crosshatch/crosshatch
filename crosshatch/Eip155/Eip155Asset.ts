import * as Address from "../Address.ts"
import * as Asset from "../Asset.ts"
import { brand } from "./_common.ts"
import { Eip155Address } from "./Eip155Address.ts"

export const Eip155Asset = Eip155Address.pipe(Address.brand, Asset.brand, brand)
