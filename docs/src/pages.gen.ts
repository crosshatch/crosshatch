// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/articles/hello_crosshatch'; render: 'static' }
  | { path: '/articles'; render: 'static' }
  | { path: '/asset'; render: 'static' }
  | { path: '/background'; render: 'static' }
  | { path: '/changelog'; render: 'static' }
  | { path: '/deposit-rebate'; render: 'static' }
  | { path: '/effect-ai'; render: 'static' }
  | { path: '/effect-atom'; render: 'static' }
  | { path: '/effect-http-client'; render: 'static' }
  | { path: '/effect-http'; render: 'static' }
  | { path: '/effect-rpc'; render: 'static' }
  | { path: '/effect-socket'; render: 'static' }
  | { path: '/extension'; render: 'static' }
  | { path: '/facilitation'; render: 'static' }
  | { path: '/fetch'; render: 'static' }
  | { path: '/immediate-settlement'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/lifecycle'; render: 'static' }
  | { path: '/merchants/deposit-rebate'; render: 'static' }
  | { path: '/merchants/effect-http'; render: 'static' }
  | { path: '/merchants/effect-rpc'; render: 'static' }
  | { path: '/merchants/granular-settlement'; render: 'static' }
  | { path: '/merchants/opentelemetry'; render: 'static' }
  | { path: '/otel'; render: 'static' }
  | { path: '/payer'; render: 'static' }
  | { path: '/payload'; render: 'static' }
  | { path: '/payment-identifiers'; render: 'static' }
  | { path: '/privacy'; render: 'static' }
  | { path: '/quickstart/for-clients'; render: 'static' }
  | { path: '/quickstart/for-merchants'; render: 'static' }
  | { path: '/quickstart'; render: 'static' }
  | { path: '/required'; render: 'static' }
  | { path: '/terms'; render: 'static' }

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>
  }
  interface CreatePagesConfig {
    pages: Page
  }
}
