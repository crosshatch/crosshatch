import { Entry } from "@napi-rs/keyring"
import { Effect, Console, Redacted, Data, Option, UndefinedOr, flow } from "effect"
import { Command, Argument, Flag, Prompt } from "effect/unstable/cli"

import * as X25519Pair from "../Crypto/X25519Pair.ts"
import * as X25519PrivateKey from "../Crypto/X25519PrivateKey.ts"
import * as X25519PublicKey from "../Crypto/X25519PublicKey.ts"
import { Eip155Address } from "../Eip155/Eip155.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { CaAccountId } from "../Ramp/CaAccountId.ts"
import { RampClient } from "../Ramp/RampClient.ts"
import { SolanaAddress } from "../Solana/Solana.ts"
import * as Ansi from "./Ansi.ts"
import * as CliError from "./CliError.ts"
import * as UserConfig from "./UserConfig.ts"

export class ProfileAlreadyExistsError extends CliError.make(
  Data.TaggedError("ProfileAlreadyExistsError")<{
    readonly profile: string
  }>,
  ({ profile }) => `Profile "${profile}" already exists.`,
) {}

const addProfile = Effect.fn(function* ({
  profile: profile_,
  mnemonic: mnemonic_,
  description,
}: {
  readonly profile: string | undefined
  readonly mnemonic: Mnemonic.Mnemonic | undefined
  readonly description: string | undefined
}) {
  let config = yield* UserConfig.read
  const profile = profile_ ?? "default"
  if (config) {
    const { profiles } = config
    if (profiles[profile]) {
      return yield* new ProfileAlreadyExistsError({ profile })
    }
  } else {
    config = { profiles: {} }
  }
  const secretEntry = new Entry("crosshatch", profile)
  const publicKey = yield* UndefinedOr.match(config.profiles[profile], {
    onUndefined: Effect.fnUntraced(function* () {
      const { privateKey, publicKey } = yield* X25519Pair.random({ extractable: true })
      yield* X25519PrivateKey.toPkcs8(privateKey).pipe(Effect.map((v) => secretEntry.setSecret(v)))
      return publicKey
    }),
    onDefined: () => new ProfileAlreadyExistsError({ profile }),
  })
  const mnemonic = mnemonic_ ?? (yield* Mnemonic.random)
  const mnemonicEncoded = new TextEncoder().encode(Redacted.value(mnemonic))
  const address = Eip155Address.fromMnemonic(mnemonic)
  const envelope = yield* X25519PublicKey.encrypt(publicKey, mnemonicEncoded)
  config.profiles[profile] = {
    address,
    mnemonic: envelope,
    dateAdded: new Date(),
    ...(description && { description }),
  }
  yield* UserConfig.write(config)
  yield* Console.log(Ansi.success(`Added profile "${profile}"; derived the following chain-specific addresses:`))
  const solanaAddress = yield* SolanaAddress.fromMnemonic(mnemonic)
  yield* Console.table({
    eip155: { address },
    solana: { address: solanaAddress },
  })
  yield* Console.log(
    Ansi.magenta(
      `Reveal the underlying mnemonic with \`crosshatch mnemonic reveal${profile_ ? ` ${profile_}` : ""} -y\`.\n`,
    ),
  )
  const shouldOnramp = yield* Prompt.confirm({
    message: "Would you like to onramp some USDC into the corresponding Base address?",
  })
  if (shouldOnramp) {
    const amount = yield* Prompt.float({
      message: "How much would you like to onramp?",
      default: 10,
      min: 1,
    })
    const ramp = yield* RampClient
    const { onrampUrl } = yield* ramp.onramp({
      payload: {
        amount,
        provider: "Coinbase",
        recipient: CaAccountId.make(`eip155:8453:${address}`, { disableChecks: true }),
      },
    })
    yield* Console.log(onrampUrl)
  }
})

const profileAddMnemonic = Command.make("mnemonic", {
  profile: Flag.string("profile"),
  mnemonic: Flag.string("mnemonic").pipe(Flag.map(Mnemonic.fromText)),
  description: Flag.string("description").pipe(Flag.optional, Flag.map(Option.getOrUndefined)),
}).pipe(
  Command.withHandler(
    Effect.fn(({ profile, mnemonic, description }) => addProfile({ profile, mnemonic, description })),
  ),
)

export const profileAdd = Command.make("add", {
  profile: Argument.string("profile").pipe(Argument.withDefault("default")),
  mnemonic: Argument.string("mnemonic").pipe(
    Argument.optional,
    Argument.map(flow(Option.map(Mnemonic.fromText), Option.getOrUndefined)),
  ),
  description: Flag.string("description").pipe(Flag.optional, Flag.map(Option.getOrUndefined)),
}).pipe(
  Command.withHandler(
    Effect.fn(({ profile, mnemonic, description }) => addProfile({ profile, mnemonic, description })),
  ),
  Command.withSubcommands([profileAddMnemonic]),
)
