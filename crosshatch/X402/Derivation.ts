import { Schema as S } from "effect"
import { Address } from "./Address.ts"
import { ChainId } from "./ChainId.ts"
import { Namespace } from "./Namespace.ts"

export const Derivation = S.Struct({
  address: Address,
  chainId: ChainId,
  namespace: Namespace,
})
