import { middlewareModules } from "vocs/waku/middleware"
import { router } from "vocs/waku/router"
import cloudflareAdapter from "waku/adapters/cloudflare"
import nodeAdapter from "waku/adapters/node"

const pages = router(import.meta.glob("/src/pages/**/*.{js,jsx,ts,tsx,md,mdx}"), {
  srcDir: "src",
})
const options = {
  middlewareModules: middlewareModules(import.meta.glob("/src/middleware/*.{js,jsx,ts,tsx,md,mdx}")),
  static: false,
}

const serverEntry = nodeAdapter(pages, options)

const workerEntry = cloudflareAdapter(pages, options).defaultExport as {
  readonly fetch: (request: Request, env: unknown) => Response | Promise<Response>
}

export const build = serverEntry.build
export const buildEnhancers = serverEntry.buildEnhancers
export const buildOptions = serverEntry.buildOptions
export default { ...serverEntry, defaultExport: workerEntry, fetch: workerEntry.fetch }
