import { Config, flow, Schema as S } from "effect"

/** EVM account address — `0x` followed by 20 bytes of hex. */
export const EvmAddress = S.TemplateLiteral([S.Literal("0x"), S.String])
  .check(S.isPattern(/^0x[a-fA-F0-9]{40}$/))
  .pipe(S.brand("Address"), S.brand("EvmAddress"))

export const config = flow(Config.string, Config.map(S.decodeUnknownSync(EvmAddress)))
