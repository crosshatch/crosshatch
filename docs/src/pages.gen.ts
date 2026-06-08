// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/allowances'; render: 'static' }
  | { path: '/articles/hello_crosshatch'; render: 'static' }
  | { path: '/articles'; render: 'static' }
  | { path: '/escalations'; render: 'static' }
  | { path: '/facilitation'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/lifecycle'; render: 'static' }
  | { path: '/merchants/deposit-rebate'; render: 'static' }
  | { path: '/merchants/effect-http'; render: 'static' }
  | { path: '/merchants/effect-rpc'; render: 'static' }
  | { path: '/merchants/granular-settlement'; render: 'static' }
  | { path: '/merchants/opentelemetry'; render: 'static' }
  | { path: '/privacy'; render: 'static' }
  | { path: '/quickstart'; render: 'static' }
  | { path: '/terms'; render: 'static' }
  | { path: '/why'; render: 'static' }

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>
  }
  interface CreatePagesConfig {
    pages: Page
  }
}
