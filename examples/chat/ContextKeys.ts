import { prefixLookup } from "@crosshatch/util/prefix"

export const ContextKeys = prefixLookup("crosshatch.chat", {
  CrosshatchChatEnv: true,
  Drizzle: true,
})
