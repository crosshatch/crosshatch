import type { WorkerDomainConfig, WorkerProps } from "alchemy/Cloudflare"
import { Stack } from "alchemy/Stack"
import { Effect } from "effect"

export const domain = (domain: string) =>
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

export const WorkerConfig = Effect.fn(function* ({
  domain: domain_,
  assets,
}: {
  readonly domain: string
  readonly assets?: string | undefined
}) {
  return {
    placement: { mode: "smart" },
    ...(yield* domain(domain_)),
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
          },
        }
      : {}),
  } satisfies Partial<WorkerProps>
})
