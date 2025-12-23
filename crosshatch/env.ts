import { Schema as S } from "effect"

export const dev = true
export const domain = `crosshatch.${dev ? "local" : "dev"}`
export const url = `https://${domain}`
export const apiUrl = dev ? "http://localhost:7776" : "https://api.crosshatch.dev"

export const LinkEnv = S.Struct({
  identityId: S.String.pipe(S.propertySignature, S.fromKey("identity-id")),
  redirect: S.String,
  nonce: S.String,
  budget: S.Number,
  icon: S.String.pipe(S.optional),
})

export const linkUrl = ({
  identityId,
  redirect,
  nonce,
  budget,
}: {
  identityId: string
  redirect?: string | undefined
  nonce?: string | undefined
  budget?: number | undefined
}) => {
  const result = new URL("link", url)
  const encoded = S.encodeSync(LinkEnv)({
    identityId,
    redirect: redirect ?? location.href,
    nonce: nonce ?? crypto.randomUUID(),
    budget: budget ?? 10,
  })
  for (const [k, v] of Object.entries(encoded)) {
    if (v) {
      result.searchParams.set(k, v.toString())
    }
  }
  return result.href
}
