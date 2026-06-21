import { Context } from "effect"

export class EvmSigner extends Context.Service<
  EvmSigner,
  {
    readonly address: `0x${string}`
    signTypedData(message: {
      domain: Record<string, unknown>
      types: Record<string, unknown>
      primaryType: string
      message: Record<string, unknown>
    }): Promise<`0x${string}`>
  }
>()("crosshatch/X402/Signer/EvmSigner") {}
