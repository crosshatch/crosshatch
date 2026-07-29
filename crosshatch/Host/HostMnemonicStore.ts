import { Effect, Layer, Redacted, Schema as S } from "effect"

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
  NameAlreadyTakenError,
  NoSuchMnemonicError,
} from "../MnemonicStore.ts"
import * as DerivedAddresses from "../Unified/DerivedAddresses.ts"
import { UserConfig } from "../UserConfig.ts"
import * as Keychain from "./Keychain.ts"

export const layer = Layer.effect(
  MnemonicStore,
  Effect.gen(function* () {
    const config = yield* UserConfig

    const list = config.get.pipe(
      Effect.map((v) => v?.mnemonics ?? {}),
      Effect.mapError((cause) => new MnemonicListError({ cause })),
    )

    const getEntry = Effect.fnUntraced(function* (name: string) {
      const mnemonic = yield* config.get.pipe(Effect.map((v) => v?.mnemonics[name]))
      if (!mnemonic) return yield* new NoSuchMnemonicError({ name })
      return mnemonic
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
        const mnemonics = yield* config.get.pipe(Effect.map((v) => v?.mnemonics))
        if (mnemonics?.[name] || (yield* Keychain.get(name))) {
          return yield* new NameAlreadyTakenError({ name })
        }
        const { privateKey, publicKey } = yield* X25519Pair.random({ extractable: true })
        const secret = yield* X25519PrivateKey.toPkcs8(privateKey)
        yield* Keychain.set(name, secret)
        const envelope = yield* X25519PublicKey.encrypt(publicKey, new TextEncoder().encode(Redacted.value(mnemonic)))
        const entry = {
          addresses: yield* DerivedAddresses.fromMnemonic(mnemonic),
          mnemonic: envelope,
          dateAdded: new Date(),
          ...(description && { description }),
        }
        yield* config
          .update((current) => ({
            ...current,
            mnemonics: { ...current.mnemonics, [name]: entry },
          }))
          .pipe(Effect.tapError(() => Keychain.remove(name)))
        return entry
      },
      Effect.catchIf(
        (v) => v._tag !== "NameAlreadyTakenError",
        (cause) => new MnemonicAddError({ cause }),
      ),
    )

    const get = Effect.fnUntraced(
      function* (name: string) {
        const { mnemonic: envelope } = yield* getEntry(name)
        const secret = yield* Keychain.get(name).pipe(Effect.flatMap(Effect.fromNullishOr))
        const privateKey = yield* X25519PrivateKey.fromPkcs8(secret)
        const encoded = yield* X25519PrivateKey.decrypt(privateKey, envelope)
        return yield* S.decodeUnknownEffect(Mnemonic.Mnemonic)(Redacted.make(new TextDecoder().decode(encoded)))
      },
      Effect.catchIf(
        (v) => v._tag !== "MnemonicNotFoundError",
        (cause) => new MnemonicGetError({ cause }),
      ),
    )

    const describe = Effect.fnUntraced(
      function* (name: string, description: string | undefined) {
        const mnemonic = yield* getEntry(name)
        const { description: _description, ...rest } = mnemonic
        yield* config.update((config) => ({
          ...config,
          mnemonics: {
            ...config.mnemonics,
            [name]: description === undefined ? rest : { ...mnemonic, description },
          },
        }))
      },
      Effect.catchIf(
        (v) => v._tag !== "MnemonicNotFoundError",
        (cause) => new MnemonicDescribeError({ cause }),
      ),
    )

    const remove = Effect.fnUntraced(
      function* (name: string) {
        yield* getEntry(name)
        yield* config.update((config) => {
          const { [name]: _removed, ...mnemonics } = config.mnemonics
          return { ...config, mnemonics }
        })
        yield* Keychain.remove(name)
      },
      Effect.catchIf(
        (v) => v._tag !== "MnemonicNotFoundError",
        (cause) => new MnemonicRemoveError({ cause }),
      ),
    )

    const rename = Effect.fnUntraced(
      function* (from: string, to: string) {
        const mnemonic = yield* getEntry(from)
        const mnemonics = yield* config.get.pipe(Effect.map((v) => v?.mnemonics))
        const secret = yield* Keychain.get(to)
        if (mnemonics?.[to] || !secret) {
          return yield* new NameAlreadyTakenError({ name: to })
        }
        yield* Keychain.set(to, secret)
        yield* config.update((current) => {
          const { [from]: _removed, ...mnemonics } = current.mnemonics
          return { ...current, mnemonics: { ...mnemonics, [to]: mnemonic } }
        })
        yield* Keychain.remove(to)
      },
      Effect.catchIf(
        (v) => v._tag !== "MnemonicNotFoundError",
        (cause) => new MnemonicRenameError({ cause }),
      ),
    )

    return { add, get, list, describe, remove, rename }
  }),
)
