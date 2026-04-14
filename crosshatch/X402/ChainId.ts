import { Schema as S } from "effect"

export const MainnetChainId = S.Literal(1)
export const BaseChainId = S.Literal(8453)
export const PolygonChainId = S.Literal(137)
export const ArbitrumChainId = S.Literal(42161)
export const OptimismChainId = S.Literal(10)

export const ChainId = S.TemplateLiteral([
  S.Union([MainnetChainId, BaseChainId, PolygonChainId, ArbitrumChainId, OptimismChainId]),
])
