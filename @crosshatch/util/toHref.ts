export const toHref = (url: URL) => <I extends Record<string, string | number | undefined>>(v: I) => {
  const result = new URL(url)
  Object.entries(v).forEach(([k, v]) => result.searchParams.set(k, `${v}`))
  return result.href
}
