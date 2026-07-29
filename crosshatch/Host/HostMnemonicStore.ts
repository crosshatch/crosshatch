import { Effect, Layer, Predicate, Redacted, Schema as S, Struct, UndefinedOr } from "effect"

import * as X25519Pair from "../Crypto/X25519Pair.ts"
import * as X25519PrivateKey from "../Crypto/X25519PrivateKey.ts"
import * as X25519PublicKey from "../Crypto/X25519PublicKey.ts"
import * as Mnemonic from "../Mnemonic.ts"
import {
  MnemonicStore,
  MnemonicAddError,
  MnemonicDescribeError,
  MnemonicGetError,
  MnemonicListError,
  MnemonicRemoveError,
  MnemonicRenameError,
  MnemonicConfigNameAlreadyTakenError,
  NoSuchMnemonicError,
  KeychainNameAlreadyTakenError,
} from "../MnemonicStore.ts"
import * as DerivedAddresses from "../Unified/DerivedAddresses.ts"
import { MnemonicConfig, UserConfig } from "../UserConfig.ts"
import * as Keychain from "./Keychain.ts"

export const layer = Layer.effect(
  MnemonicStore,
  Effect.gen(function* () {
    const config = yield* UserConfig
    const mnemonicConfigs = config.get.pipe(Effect.map(Struct.get("mnemonics")))
    const mnemonicConfig = Effect.fnUntraced(function* (name: string) {
      const mnemonic = yield* mnemonicConfigs.pipe(Effect.map(Struct.get(name)))
      if (!mnemonic) return yield* new NoSuchMnemonicError({ name })
      return mnemonic
    })

    const list = mnemonicConfigs.pipe(Effect.mapError((cause) => new MnemonicListError({ cause })))

    const ensureAvailability = Effect.fnUntraced(function* (name: string) {
      yield* mnemonicConfigs.pipe(
        Effect.filterOrFail(Predicate.hasProperty(name), () => new MnemonicConfigNameAlreadyTakenError({ name })),
      )
      yield* Keychain.get(name).pipe(
        Effect.filterOrFail(Predicate.isUndefined, () => new KeychainNameAlreadyTakenError({ name })),
      )
    })

    const add = Effect.fnUntraced(
      function* ({
        description,
        mnemonic,
        name,
      }: {
        readonly description?: string | undefined
        readonly mnemonic: Mnemonic.Mnemonic
        readonly name: string
      }) {
        yield* ensureAvailability(name)
        const { privateKey, publicKey } = yield* X25519Pair.random({ extractable: true })
        const secret = yield* X25519PrivateKey.toPkcs8(privateKey)
        const envelope = yield* X25519PublicKey.encrypt(publicKey, new TextEncoder().encode(Redacted.value(mnemonic)))
        const mnemonicConfig: MnemonicConfig = {
          addresses: yield* DerivedAddresses.fromMnemonic(mnemonic),
          envelope,
          dateAdded: new Date(),
          ...(description && { description }),
        }
        yield* Keychain.set(name, secret).pipe(
          Effect.andThen(config.update(Struct.evolve({ mnemonics: Struct.assign({ [name]: mnemonicConfig }) }))),
        )
        return mnemonicConfig
      },
      Effect.mapError((cause) => new MnemonicAddError({ cause })),
    )

    const get = Effect.fnUntraced(
      function* (name: string) {
        const { envelope } = yield* mnemonicConfig(name)
        const privateKey = yield* Keychain.get(name).pipe(
          Effect.flatMap(
            UndefinedOr.match({
              onDefined: Effect.succeed,
              onUndefined: () => new NoSuchMnemonicError({ name }),
            }),
          ),
          Effect.flatMap(X25519PrivateKey.fromPkcs8),
        )
        return yield* X25519PrivateKey.decrypt(privateKey, envelope).pipe(
          Effect.map((v) => Redacted.make(new TextDecoder().decode(v))),
          Effect.flatMap(S.decodeUnknownEffect(Mnemonic.Mnemonic)),
        )
      },
      Effect.mapError((cause) => new MnemonicGetError({ cause })),
    )

    const describe = (name: string, description: string | undefined) =>
      config
        .update(
          Struct.evolve({
            mnemonics: description
              ? Struct.omit([name])
              : Struct.evolve({
                  [name]: Struct.evolve({ description }),
                }),
          }),
        )
        .pipe(Effect.mapError((cause) => new MnemonicDescribeError({ cause })))

    const remove = Effect.fnUntraced(
      function* (name: string) {
        yield* mnemonicConfig(name)
        yield* Keychain.remove(name).pipe(
          Effect.andThen(config.update(Struct.evolve({ mnemonics: Struct.omit([name]) }))),
        )
      },
      Effect.mapError((cause) => new MnemonicRemoveError({ cause })),
    )

    const rename = Effect.fnUntraced(
      function* (from: string, to: string) {
        yield* mnemonicConfig(from)
        yield* ensureAvailability(to)
        const secret = yield* Keychain.get(from).pipe(Effect.flatMap(Effect.fromNullishOr))
        yield* Keychain.set(to, secret)
        yield* config
          .update(Struct.evolve({ mnemonics: Struct.renameKeys({ [from]: to }) }))
          .pipe(Effect.tapError(() => Keychain.remove(to)))
        yield* Keychain.remove(from)
      },
      Effect.mapError((cause) => new MnemonicRenameError({ cause })),
    )

    return { add, get, list, describe, remove, rename }
  }),
)
