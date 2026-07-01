import { Entry } from "@napi-rs/keyring"
import { Console, Data, Effect, UndefinedOr } from "effect"
import { Command, Argument } from "effect/unstable/cli"

import * as X25519PrivateKey from "../Crypto/X25519PrivateKey.ts"
import * as UserConfig from "./UserConfig.ts"

export class ProfileNotFoundError extends Data.TaggedError("ProfileNotFoundError")<{
  readonly profile: string
}> {}

export class ProfileSecretNotFoundError extends Data.TaggedError("ProfileSecretNotFoundError")<{
  readonly profile: string
}> {}

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
