import { Cloudflare } from "@cloudflare/workers-types"

export const unsafeEnv: Record<keyof any, unknown> = (
  "env" in Cloudflare && Cloudflare.env && typeof Cloudflare.env === "object" && Cloudflare.env !== null
    ? Cloudflare.env
    : {}
) as never
