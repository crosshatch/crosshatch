import { DateTime, Effect, Layer, Predicate, Redacted, Schema as S, Struct, UndefinedOr } from "effect"

import { X25519Pair, X25519PrivateKey, X25519PublicKey } from "../Crypto/index.ts"
import { Mnemonic, MnemonicStore, UserConfig, Keychain } from "../index.ts"
import { DerivedAddresses } from "../Unified/index.ts"

export const layer = Layer.effect(
  MnemonicStore.MnemonicStore,
  Effect.gen(function* () {
    const keychain = yield* Keychain.Keychain
    const config = yield* UserConfig.UserConfig
    const mnemonicConfigs = config.get.pipe(Effect.map(Struct.get("mnemonics")))
    const mnemonicConfig = Effect.fnUntraced(function* (name: string) {
      const mnemonic = yield* mnemonicConfigs.pipe(Effect.map(Struct.get(name)))
      if (!mnemonic) return yield* new MnemonicStore.NoSuchMnemonicError({ name })
      return mnemonic
    })

    const list = mnemonicConfigs.pipe(Effect.mapError((cause) => new MnemonicStore.MnemonicListError({ cause })))

    const ensureAvailability = Effect.fnUntraced(function* (name: string) {
      yield* mnemonicConfigs.pipe(
        Effect.filterOrFail(
          Predicate.hasProperty(name),
          () => new MnemonicStore.MnemonicConfigNameAlreadyTakenError({ name }),
        ),
      )
      yield* keychain
        .get(name)
        .pipe(
          Effect.filterOrFail(Predicate.isUndefined, () => new MnemonicStore.KeychainNameAlreadyTakenError({ name })),
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
        const mnemonicConfig: UserConfig.MnemonicConfig = {
          addresses: yield* DerivedAddresses.fromMnemonic(mnemonic),
          envelope,
          dateAdded: yield* DateTime.now,
          ...(description && { description }),
        }
        yield* keychain
          .set(name, secret)
          .pipe(Effect.andThen(config.update(Struct.evolve({ mnemonics: Struct.assign({ [name]: mnemonicConfig }) }))))
        return mnemonicConfig
      },
      Effect.mapError((cause) => new MnemonicStore.MnemonicAddError({ cause })),
    )

    const get = Effect.fnUntraced(
      function* (name: string) {
        const { envelope } = yield* mnemonicConfig(name)
        const privateKey = yield* keychain.get(name).pipe(
          Effect.flatMap(
            UndefinedOr.match({
              onDefined: Effect.succeed,
              onUndefined: () => new MnemonicStore.NoSuchMnemonicError({ name }),
            }),
          ),
          Effect.flatMap(X25519PrivateKey.fromPkcs8),
        )
        return yield* X25519PrivateKey.decrypt(privateKey, envelope).pipe(
          Effect.map((v) => Redacted.make(new TextDecoder().decode(v))),
          Effect.flatMap(S.decodeUnknownEffect(Mnemonic.Mnemonic)),
        )
      },
      Effect.mapError((cause) => new MnemonicStore.MnemonicGetError({ cause })),
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
        .pipe(Effect.mapError((cause) => new MnemonicStore.MnemonicDescribeError({ cause })))

    const remove = Effect.fnUntraced(
      function* (name: string) {
        yield* mnemonicConfig(name)
        yield* keychain
          .remove(name)
          .pipe(Effect.andThen(config.update(Struct.evolve({ mnemonics: Struct.omit([name]) }))))
      },
      Effect.mapError((cause) => new MnemonicStore.MnemonicRemoveError({ cause })),
    )

    const rename = Effect.fnUntraced(
      function* (from: string, to: string) {
        yield* mnemonicConfig(from)
        yield* ensureAvailability(to)
        const secret = yield* keychain.get(from).pipe(Effect.flatMap(Effect.fromNullishOr))
        yield* keychain.set(to, secret)
        yield* config
          .update(Struct.evolve({ mnemonics: Struct.renameKeys({ [from]: to }) }))
          .pipe(Effect.tapError(() => keychain.remove(to)))
        yield* keychain.remove(from)
      },
      Effect.mapError((cause) => new MnemonicStore.MnemonicRenameError({ cause })),
    )

    return { add, get, list, describe, remove, rename }
  }),
)
