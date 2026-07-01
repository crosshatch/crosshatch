import { Config, flow, Schema as S } from "effect"

import { Namespace } from "./Namespace.ts"
import { Reference } from "./Reference.ts"

/** Encoded CAIP-2 chain id — `namespace:reference`. */
export const ChainId = S.TemplateLiteral([Namespace, ":", Reference]).pipe(S.brand("crosshatch/ChainId"))

export const config = flow(Config.string, Config.map(S.decodeUnknownSync(ChainId)))
