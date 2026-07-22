interface SiwxMessageParams {
  readonly header: string
  readonly address: string
  readonly chainId: string
  readonly domain: string
  readonly uri: string
  readonly version?: string | undefined
  readonly statement?: string | undefined
  readonly nonce: string
  readonly issuedAt: string
  readonly expirationTime?: string | undefined
  readonly notBefore?: string | undefined
  readonly requestId?: string | undefined
  readonly resources?: ReadonlyArray<string> | undefined
}

export const buildSiwxMessage = ({ header, address, chainId, ...unsigned }: SiwxMessageParams) => {
  const lines = [header, address]

  if (unsigned.statement) {
    lines.push("", unsigned.statement)
  }

  lines.push(
    "",
    `URI: ${unsigned.uri}`,
    `Version: ${unsigned.version ?? "1"}`,
    `Chain ID: ${chainId}`,
    `Nonce: ${unsigned.nonce}`,
    `Issued At: ${unsigned.issuedAt}`,
  )

  if (unsigned.expirationTime) {
    lines.push(`Expiration Time: ${unsigned.expirationTime}`)
  }
  if (unsigned.notBefore) {
    lines.push(`Not Before: ${unsigned.notBefore}`)
  }
  if (unsigned.requestId) {
    lines.push(`Request ID: ${unsigned.requestId}`)
  }
  if (unsigned.resources) {
    lines.push("Resources:", ...unsigned.resources.map((resource) => `- ${resource}`))
  }

  return lines.join("\n")
}
