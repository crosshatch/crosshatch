export interface EvmSigner {
  readonly address: `0x${string}`

  readonly signTypedData: (message: {
    domain: Record<string, unknown>
    types: Record<string, unknown>
    primaryType: string
    message: Record<string, unknown>
  }) => Promise<`0x${string}`>
}
