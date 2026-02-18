export type EnvLike = Record<string, string | undefined>

export const resolveEnv = (): EnvLike => {
  // Reference `import.meta.env` directly so that bundlers (e.g. Vite) can
  // statically replace it with the env object. Avoid guarding with
  // `"env" in import.meta`, as the bundler replaces `import.meta.env`
  // references at the syntax level without actually adding an `env`
  // property to the runtime `import.meta` object.
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any).env
    if (env) return env as EnvLike
  } catch {}
  try {
    if (typeof process !== "undefined" && process.env) return process.env as EnvLike
  } catch {}
  return {}
}
