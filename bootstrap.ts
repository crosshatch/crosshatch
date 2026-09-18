import { GithubDeployer } from "@crosshatch/alchemy"
import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Eip155Address } from "crosshatch/Eip155"
import { SolanaAddress } from "crosshatch/Solana"
import { Layer, Effect, Config } from "effect"

const owner = "crosshatch"
const repository = "crosshatch"

export default Alchemy.Stack(
  "github-crosshatch-crosshatch",
  {
    state: Cloudflare.state(),
    providers: Layer.mergeAll(Github.providers(), Cloudflare.providers()),
  },
  Effect.gen(function* () {
    yield* GithubDeployer({ owner, repository })
    yield* Github.Variables({
      owner,
      repository,
      variables: {
        CDP_API_KEY_ID: Config.String("CDP_API_KEY_ID"),
        EIP155_ADDRESS: Config.schema(Eip155Address.Eip155Address, "EIP155_ADDRESS"),
        SOLANA_ADDRESS: Config.schema(SolanaAddress.SolanaAddress, "SOLANA_ADDRESS"),
        OTEL_EXPORTER_OTLP_ENDPOINT: "https://ingest.us2.signoz.cloud",
      },
    })
    yield* Github.Secrets({
      owner,
      repository,
      secrets: {
        CDP_API_KEY_SECRET: Config.Redacted("CDP_API_KEY_SECRET"),
        OTEL_EXPORTER_OTLP_HEADERS: Config.Redacted("OTEL_EXPORTER_OTLP_HEADERS"),
        MNEMONIC: Config.Redacted("MNEMONIC"),
        BASE_RPC_URL: Config.Redacted("BASE_RPC_URL"),
      },
    })
  }),
)
