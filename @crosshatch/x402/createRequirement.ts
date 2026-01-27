import type { Address } from "./Address.ts"
import type { PaymentRequired } from "./schemas.ts"

export const createRequirement = ({ recipient, amount }: {
  recipient: typeof Address.Type
  amount: bigint
}): typeof PaymentRequired.Type => ({
  x402Version: 2,
  accepts: [{
    amount: String(amount),
    asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    extra: {},
    maxTimeoutSeconds: 60,
    network: `eip155:8453`,
    payTo: recipient,
    scheme: "exact",
  }],
  resource: {
    description: "",
    mimeType: "",
    url: "",
  },
})
