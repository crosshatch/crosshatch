import { Config, flow, Schema as S } from "effect"

import { EvmAddress } from "./EvmAddress.ts"

export const EvmAsset = EvmAddress.pipe(S.brand("crosshatch/Asset"))

export const config = flow(Config.string, Config.map(S.decodeUnknownSync(EvmAsset)))
