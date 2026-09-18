import type { WorkerDomainConfig, WorkerProps } from "alchemy/Cloudflare"
import { Stack } from "alchemy/Stack"
import { Effect } from "effect"

export const config = Effect.fnUntraced(function* ({
  domain: domain_,
  assets,
  port,
  main,
}: {
  readonly main?: string | undefined
  readonly domain: string
  readonly assets?: string | undefined
  readonly port: number
}) {
  return {
    ...(yield* domain(domain_)),
    ...(main ? { main } : {}),
    observability: { enabled: true },
    placement: { mode: "smart" },
    compatibility: {
      date: "2026-02-05",
      flags: ["nodejs_compat", "global_fetch_strictly_public"],
    },
    ...(assets
      ? {
          rootDir: assets,
          assets: {
            notFoundHandling: "single-page-application",
            directory: "dist",
            htmlHandling: "drop-trailing-slash",
          },
        }
      : {}),
    dev: {
      host: "127.0.0.1",
      port,
      strictPort: true,
    },
  } satisfies WorkerProps
})

const domain = (domain: string) =>
  Stack.pipe(
    Effect.map(({ stage }) =>
      stage === "prod" ? withAlias(domain) : stage.startsWith("staging-") ? withAlias(`${stage}.${domain}`) : {},
    ),
  )

const withAlias = (name: string) => ({
  domain: {
    name,
    aliases: [`www.${name}`],
  } satisfies WorkerDomainConfig,
})
