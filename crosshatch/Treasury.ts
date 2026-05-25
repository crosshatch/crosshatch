import { AccountAddress } from "@crosshatch/caip"
import { Context, Layer } from "effect"

export class Treasury extends Context.Service<Treasury, typeof AccountAddress.Type>()("crosshatch/Treasury") {}

export const layer = (address: typeof AccountAddress.Type) => Layer.succeed(Treasury, address)
