export const registerCommand = (
  match: (e: KeyboardEvent) => boolean,
  f: (e: KeyboardEvent) => void | Promise<void>,
) => {
  const controller = new AbortController()
  addEventListener(
    "keydown",
    async (e) => {
      if (match(e)) {
        e.preventDefault()
        controller.abort()
        await f(e)
      }
    },
    {
      signal: controller.signal,
    },
  )
  return () => controller.abort()
}
