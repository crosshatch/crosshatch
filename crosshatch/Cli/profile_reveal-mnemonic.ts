import { Entry } from "@napi-rs/keyring"
import { Console, Data, Effect, UndefinedOr } from "effect"
import { Command, Argument } from "effect/unstable/cli"

import * as X25519PrivateKey from "../Crypto/X25519PrivateKey.ts"
import * as CliError from "./CliError.ts"
import * as UserConfig from "./UserConfig.ts"

export class ProfileNotFoundError extends CliError.make(
  Data.TaggedError("ProfileNotFoundError")<{
    readonly profile: string
  }>,
  ({ profile }) => `Profile "${profile}" was not found.`,
) {}

export class ProfileSecretNotFoundError extends CliError.make(
  Data.TaggedError("ProfileSecretNotFoundError")<{
    readonly profile: string
  }>,
  ({ profile }) => `No keychain secret was found for profile "${profile}".`,
) {}

export const profileRevealMnemonic = Command.make("reveal-mnemonic", {
  profile: Argument.string("profile").pipe(Argument.withDefault("default")),
}).pipe(
  Command.withHandler(
    Effect.fn(function* ({ profile }) {
      const config = yield* UserConfig.read
      const envelope = config?.profiles[profile]?.mnemonic
      if (!envelope) {
        return yield* new ProfileNotFoundError({ profile })
      }
      const secretEntry = new Entry("crosshatch", profile)
      const privateKey = yield* UndefinedOr.match(secretEntry.getSecret() ?? undefined, {
        onUndefined: () => new ProfileSecretNotFoundError({ profile }),
        onDefined: (value) => X25519PrivateKey.fromPkcs8(new Uint8Array(value)),
      })
      const mnemonicEncoded = yield* X25519PrivateKey.decrypt(privateKey, envelope)
      yield* Console.log(new TextDecoder().decode(mnemonicEncoded))
    }),
  ),
)
