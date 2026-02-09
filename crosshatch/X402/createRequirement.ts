import type { Address } from "./Address.ts"
import type { Accepts, PaymentRequired, PaymentRequirements, ResourceInfo } from "./schemas.ts"

export const createRequirements = ({
  recipient,
  amount,
  timeout,
}: {
  recipient: typeof Address.Type
  amount: string
  timeout?: number | undefined
}): typeof PaymentRequirements.Type => ({
  amount,
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  extra: {
    name: "USDC",
    version: "2",
  },
  maxTimeoutSeconds: timeout ?? 60,
  network: `eip155:8453`,
  payTo: recipient,
  scheme: "exact",
})

export const createRequired = ({ accepts, resource }: {
  accepts: typeof Accepts.Type
  resource?: typeof ResourceInfo.Type | undefined
}): typeof PaymentRequired.Type => ({
  x402Version: 2,
  accepts,
  resource,
})
