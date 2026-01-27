export const getParentContext = () => {
  try {
    if (globalThis.self !== globalThis.top) {
      return globalThis.top
    }
    // oxlint-disable-next-line no-unused-vars
  } catch (_e: unknown) {}
  return null
}
