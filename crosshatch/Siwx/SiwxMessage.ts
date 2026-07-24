import { Option, Schema as S } from "effect"

const Rfc3339 = S.String.check(
  S.isPattern(/^\d{4}-\d{2}-\d{2}[Tt]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[Zz]|[+-]\d{2}:\d{2})$/u),
  S.makeFilter((value) =>
    Option.isSome(S.decodeUnknownOption(S.DateTimeUtcFromString)(value)) ? undefined : "Expected an RFC 3339 date-time",
  ),
)

const Uri = S.String.check(
  S.makeFilter((value) =>
    Option.isSome(S.decodeUnknownOption(S.URLFromString)(value)) ? undefined : "Expected an RFC 3986 URI",
  ),
)

export const messageFields = {
  domain: S.String.check(
    S.makeFilter((value) => {
      const url = URL.parse(`https://${value}`)
      return url && url.host === value ? undefined : "Expected an RFC 3986 authority"
    }),
  ),
  uri: Uri,
  version: S.Literal("1"),
  statement: S.String.check(S.isPattern(/^[^\r\n]+$/u)).pipe(S.optional),
  nonce: S.String.check(S.isPattern(/^[a-zA-Z0-9]{8,}$/u)),
  issuedAt: Rfc3339,
  expirationTime: Rfc3339.pipe(S.optional),
  notBefore: Rfc3339.pipe(S.optional),
  requestId: S.String.check(S.isPattern(/^(?:[a-zA-Z0-9._~!$&'()*+,;=:@-]|%[a-fA-F0-9]{2})*$/u)).pipe(S.optional),
  resources: S.Array(Uri).pipe(S.optional),
}

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
