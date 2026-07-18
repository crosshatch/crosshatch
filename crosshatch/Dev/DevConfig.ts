export interface DevConfig {
  readonly hostname: string
  readonly port: number
  readonly otelEndpoint: string | undefined
}
