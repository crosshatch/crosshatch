import { Data, Effect, Redacted, Schema as S } from "effect"

import * as X25519Pair from "../Crypto/X25519Pair.ts"
import * as X25519PrivateKey from "../Crypto/X25519PrivateKey.ts"
import * as X25519PublicKey from "../Crypto/X25519PublicKey.ts"
import * as Mnemonic from "../Mnemonic.ts"
import * as PrintableError from "../PrintableError.ts"
import * as DerivedAddresses from "../Unified/DerivedAddresses.ts"
import * as UserConfig from "../UserConfig.ts"
import * as Keychain from "./Keychain.ts"

export class NotFoundError extends PrintableError.make(
  Data.TaggedError("MnemonicNotFoundError")<{ readonly name: string }>,
  ({ name }) => `Mnemonic "${name}" was not found.`,
) {}

export class AlreadyExistsError extends PrintableError.make(
  Data.TaggedError("MnemonicAlreadyExistsError")<{ readonly name: string }>,
  ({ name }) => `A mnemonic with the name "${name}" already exists.`,
) {}

export const getEntry = Effect.fn(function* (name: string) {
  const config = yield* UserConfig.get
  const mnemonic = config?.mnemonics[name]
  if (!mnemonic) return yield* new NotFoundError({ name })
  return mnemonic
})

export const list = UserConfig.get.pipe(Effect.map((v) => v?.mnemonics ?? {}))

export const get = Effect.fn(function* (name: string) {
  const { mnemonic: envelope } = yield* getEntry(name)
  const secret = yield* Keychain.get(name).pipe(Effect.flatMap(Effect.fromNullishOr))
  const privateKey = yield* X25519PrivateKey.fromPkcs8(secret)
  const encoded = yield* X25519PrivateKey.decrypt(privateKey, envelope)
  return yield* S.decodeUnknownEffect(Mnemonic.Mnemonic)(Redacted.make(new TextDecoder().decode(encoded)))
})

export const add = Effect.fn(function* ({
  description,
  mnemonic,
  name,
}: {
  readonly description?: string | undefined
  readonly mnemonic: Mnemonic.Mnemonic
  readonly name: string
}) {
  const config = yield* UserConfig.get
  if (config?.mnemonics[name] || (yield* Keychain.get(name))) {
    return yield* new AlreadyExistsError({ name })
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
  yield* UserConfig.update((current) => ({
    ...current,
    mnemonics: { ...current.mnemonics, [name]: entry },
  })).pipe(Effect.tapError(() => Keychain.remove(name)))
  return entry
})

export const describe = Effect.fn(function* (name: string, description: string | undefined) {
  const mnemonic = yield* getEntry(name)
  const { description: _description, ...rest } = mnemonic
  yield* UserConfig.update((config) => ({
    ...config,
    mnemonics: {
      ...config.mnemonics,
      [name]: description === undefined ? rest : { ...mnemonic, description },
    },
  }))
})

export const remove = Effect.fn(function* (name: string) {
  yield* getEntry(name)
  yield* UserConfig.update((config) => {
    const { [name]: _removed, ...mnemonics } = config.mnemonics
    return { ...config, mnemonics }
  })
  yield* Keychain.remove(name)
})

export const rename = Effect.fn(function* (from: string, to: string) {
  const mnemonic = yield* getEntry(from)
  const config = yield* UserConfig.get
  const secret = yield* Keychain.get(to)
  if (config?.mnemonics[to] || !secret) {
    return yield* new AlreadyExistsError({ name: to })
  }
  yield* Keychain.set(to, secret)
  yield* UserConfig.update((current) => {
    const { [from]: _removed, ...mnemonics } = current.mnemonics
    return { ...current, mnemonics: { ...mnemonics, [to]: mnemonic } }
  })
  yield* Keychain.remove(to)
})
