import { GithubDeployer } from "@crosshatch/alchemy"
import * as Alchemy from "alchemy"
import * as Cloudflare from "alchemy/Cloudflare"
import * as Github from "alchemy/GitHub"
import { Address, Mnemonic } from "crosshatch"
import { Eip155 } from "crosshatch/namespaces/Eip155"
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
        PAY_TO_EIP155: Address.fromConfig(Eip155.Eip155, "PAY_TO_EIP155").pipe(Config.map((v) => v.raw)),
        OTEL_EXPORTER_OTLP_ENDPOINT: "https://ingest.us2.signoz.cloud",
      },
    })
    yield* Github.Secrets({
      owner,
      repository,
      secrets: {
        CDP_API_KEY_SECRET: Config.redacted("CDP_API_KEY_SECRET"),
        OTEL_EXPORTER_OTLP_HEADERS: Config.redacted("OTEL_EXPORTER_OTLP_HEADERS"),
        MNEMONIC: Mnemonic.fromConfig("MNEMONIC").pipe(Config.map((v) => v.raw)),
        BASE_RPC_URL: Config.redacted("BASE_RPC_URL"),
      },
    })
  }),
)
