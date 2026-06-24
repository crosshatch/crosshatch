import { EvmAddress } from "./EvmAddress.ts"

export interface EvmSigner {
  readonly address: typeof EvmAddress.Encoded

  readonly signTypedData: (message: {
    domain: Record<string, unknown>
    types: Record<string, unknown>
    primaryType: string
    message: Record<string, unknown>
  }) => Promise<typeof EvmAddress.Encoded>
}
