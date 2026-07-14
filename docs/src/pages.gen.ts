// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages } from 'waku/router'

// prettier-ignore
type Page =
  | { path: '/articles/hello-crosshatch'; render: 'static' }
  | { path: '/articles'; render: 'static' }
  | { path: '/asset'; render: 'static' }
  | { path: '/bridge'; render: 'static' }
  | { path: '/changelog'; render: 'static' }
  | { path: '/eip155'; render: 'static' }
  | { path: '/extension'; render: 'static' }
  | { path: '/facilitation'; render: 'static' }
  | { path: '/'; render: 'static' }
  | { path: '/lifecycle'; render: 'static' }
  | { path: '/mnemonic'; render: 'static' }
  | { path: '/payer'; render: 'static' }
  | { path: '/payload'; render: 'static' }
  | { path: '/quickstart/for-clients'; render: 'static' }
  | { path: '/quickstart/for-merchants'; render: 'static' }
  | { path: '/quickstart'; render: 'static' }
  | { path: '/required'; render: 'static' }
  | { path: '/scheme'; render: 'static' }
  | { path: '/solana'; render: 'static' }

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>
  }
  interface CreatePagesConfig {
    pages: Page
  }
}
