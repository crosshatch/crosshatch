export type EnvLike = Record<string, string | undefined>

declare global {
  const process: undefined | { readonly env?: unknown }
}

export const resolveEnv = (): EnvLike => {
  try {
    const env = (import.meta as any).env
    if (env) return env as EnvLike
  } catch {}
  try {
    if (typeof process !== "undefined" && process.env) return process.env as EnvLike
  } catch {}
  return {}
}
