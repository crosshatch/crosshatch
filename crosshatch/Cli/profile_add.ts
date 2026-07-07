import { Entry } from "@napi-rs/keyring"
import { Effect, Console, Redacted, Data, Option, UndefinedOr, flow } from "effect"
import { Command, Argument, Prompt } from "effect/unstable/cli"

import * as X25519Pair from "../Crypto/X25519Pair.ts"
import * as X25519PrivateKey from "../Crypto/X25519PrivateKey.ts"
import * as X25519PublicKey from "../Crypto/X25519PublicKey.ts"
import { EvmAddress } from "../Evm/Evm.ts"
import * as Mnemonic from "../Mnemonic.ts"
import { CaAccountId } from "../Ramp/CaAccountId.ts"
import { RampClient } from "../Ramp/RampClient.ts"
import * as UserConfig from "./UserConfig.ts"

export class ProfileAlreadyExistsError extends Data.TaggedError("ProfileAlreadyExistsError")<{
  readonly profile: string
}> {}

export const profileAdd = Command.make("add", {
  profile: Argument.string("profile").pipe(Argument.withDefault("default")),
  mnemonic: Argument.string("mnemonic").pipe(
    Argument.optional,
    Argument.map(flow(Option.map(Mnemonic.make), Option.getOrUndefined)),
  ),
}).pipe(
  Command.withHandler(
    Effect.fn(function* ({ profile, mnemonic }) {
      let config = yield* UserConfig.read
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
          const { privateKey, publicKey } = yield* X25519Pair.random({
            extractable: true,
          })
          yield* X25519PrivateKey.toPkcs8(privateKey).pipe(Effect.map((v) => secretEntry.setSecret(v)))
          return publicKey
        }),
        onDefined: () => new ProfileAlreadyExistsError({ profile }),
      })
      mnemonic ??= yield* Mnemonic.random
      const mnemonicEncoded = new TextEncoder().encode(Redacted.value(mnemonic))
      const address = EvmAddress.fromMnemonic(mnemonic)
      const envelope = yield* X25519PublicKey.encrypt(publicKey, mnemonicEncoded)
      config.profiles[profile] = {
        address,
        mnemonic: envelope,
      }
      yield* UserConfig.write(config)
      yield* Console.log(Redacted.value(mnemonic))
      const shouldOnramp = yield* Prompt.confirm({
        message: "Would you like to onramp some USDC into your new account?",
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
            recipient: CaAccountId.make(`eip155:8453:${address}`),
          },
        })
        yield* Console.log(onrampUrl)
      }
    }),
  ),
)
