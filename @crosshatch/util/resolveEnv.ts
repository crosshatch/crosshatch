export type EnvLike = Record<string, string | undefined>

export const resolveEnv = (): EnvLike => {
  const metaEnv = typeof import.meta !== "undefined" && "env" in import.meta && (import.meta as { env?: EnvLike }).env
  if (metaEnv) return metaEnv
  if (typeof process !== "undefined" && process.env) return process.env as EnvLike
  return {}
}
