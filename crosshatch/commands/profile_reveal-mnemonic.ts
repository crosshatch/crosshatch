import { Entry } from "@napi-rs/keyring"
import { Console, Data, Effect, UndefinedOr } from "effect"
import { Command, Argument } from "effect/unstable/cli"

import { X25519PrivateKey } from "../Crypto/Crypto.ts"
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
      const secret = yield* UndefinedOr.match(secretEntry.getSecret() ?? undefined, {
        onUndefined: () => new ProfileSecretNotFoundError({ profile }),
        onDefined: (value) => Effect.succeed(new Uint8Array(value)),
      })
      const privateKey = yield* X25519PrivateKey.fromPkcs8(secret)
      const mnemonicEncoded = yield* X25519PrivateKey.decrypt(privateKey, envelope)
      yield* Console.log(new TextDecoder().decode(mnemonicEncoded))
    }),
  ),
)
