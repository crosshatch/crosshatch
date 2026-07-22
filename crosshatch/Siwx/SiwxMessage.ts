interface SiwxParams {
  readonly address: string
  readonly chainId: string
  readonly expirationTime?: string | undefined
  readonly header: string
  readonly issuedAt: string
  readonly nonce: string
  readonly notBefore?: string | undefined
  readonly requestId?: string | undefined
  readonly resources?: ReadonlyArray<string> | undefined
  readonly statement?: string | undefined
  readonly uri: string
  readonly version?: string | undefined
}

export const buildSiwxMessage = ({
  address,
  chainId,
  expirationTime,
  header,
  issuedAt,
  nonce,
  notBefore,
  requestId,
  resources,
  statement,
  uri,
  version,
}: SiwxParams) => {
  const lines = [header, address]

  if (statement) {
    lines.push("", statement)
  }

  lines.push(
    "",
    `URI: ${uri}`,
    `Version: ${version ?? "1"}`,
    `Chain ID: ${chainId}`,
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  )

  if (expirationTime) {
    lines.push(`Expiration Time: ${expirationTime}`)
  }
  if (notBefore) {
    lines.push(`Not Before: ${notBefore}`)
  }
  if (requestId) {
    lines.push(`Request ID: ${requestId}`)
  }
  if (resources) {
    lines.push("Resources:", ...resources.map((resource) => `- ${resource}`))
  }

  return lines.join("\n")
}
