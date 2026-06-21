import { Config, flow, Schema as S } from "effect"

import { ChainIdString } from "./2.ts"
import { AccountAddress } from "./10.ts"

export const chainIdString = flow(Config.string, Config.map(S.decodeUnknownSync(ChainIdString)))

export const accountAddress = flow(Config.string, Config.map(S.decodeUnknownSync(AccountAddress)))
