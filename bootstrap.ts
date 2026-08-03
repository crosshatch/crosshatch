import { GithubDeployer } from "@crosshatch/alchemy/GithubDeployer"
import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Eip155Address } from "crosshatch/Eip155"
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
        CDP_API_KEY_ID: Config.string("CDP_API_KEY_ID"),
        PAY_TO_EIP155: Config.schema(Eip155Address.Eip155Address, "PAY_TO_EIP155"),
        OTEL_EXPORTER_OTLP_ENDPOINT: "https://ingest.us2.signoz.cloud",
      },
    })
    yield* Github.Secrets({
      owner,
      repository,
      secrets: {
        CDP_API_KEY_SECRET: Config.redacted("CDP_API_KEY_SECRET"),
        OTEL_EXPORTER_OTLP_HEADERS: Config.redacted("OTEL_EXPORTER_OTLP_HEADERS"),
        MNEMONIC: Config.redacted("MNEMONIC"),
        BASE_RPC_URL: Config.redacted("BASE_RPC_URL"),
      },
    })
  }),
)
