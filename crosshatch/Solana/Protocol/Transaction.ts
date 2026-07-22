/* oxlint-disable no-bitwise -- byte-level codec */
import { Effect, Encoding } from "effect"

import { Ed25519PrivateKey } from "../../Crypto/Crypto.ts"
import * as Address from "./Address.ts"
import { concat, encodeShortU16 } from "./Codec.ts"
import { SvmProtocolError } from "./Error.ts"
import { AccountRole, type Instruction, type TransactionMessage } from "./TransactionMessage.ts"

export interface Transaction {
  readonly messageBytes: Uint8Array
  readonly signatures: Readonly<Record<Address.Address, Uint8Array | null>>
}

interface OrderedAccount {
  readonly address: Address.Address
  readonly role: AccountRole
  readonly feePayer: boolean
}

const isSigner = (role: AccountRole) => (role & AccountRole.READONLY_SIGNER) !== 0
const isWritable = (role: AccountRole) => (role & AccountRole.WRITABLE) !== 0

const ADDRESS_COMPARATOR = new Intl.Collator("en", {
  caseFirst: "lower",
  ignorePunctuation: false,
  localeMatcher: "best fit",
  numeric: false,
  sensitivity: "variant",
  usage: "sort",
}).compare

const getOrderedAccounts = Effect.fnUntraced(function* (
  feePayer: Address.Address,
  instructions: ReadonlyArray<Instruction>,
) {
  const accounts = new Map<Address.Address, OrderedAccount>([
    [feePayer, { address: feePayer, role: AccountRole.WRITABLE_SIGNER, feePayer: true }],
  ])
  const invokedPrograms = new Set<Address.Address>()

  const upsert = (accountAddress: Address.Address, role: AccountRole) => {
    const existing = accounts.get(accountAddress)
    if (existing?.feePayer) return Effect.void
    const mergedRole = existing === undefined ? role : ((existing.role | role) as AccountRole)
    if (invokedPrograms.has(accountAddress) && isWritable(mergedRole)) {
      return Effect.fail(
        new SvmProtocolError({
          message: `Invoked program cannot be writable: ${accountAddress}`,
        }),
      )
    }
    accounts.set(accountAddress, { address: accountAddress, role: mergedRole, feePayer: false })
    return Effect.void
  }

  for (const instruction of instructions) {
    invokedPrograms.add(instruction.programAddress)
    const existingProgram = accounts.get(instruction.programAddress)
    if (existingProgram?.feePayer) {
      return yield* new SvmProtocolError({
        message: "An invoked program cannot pay transaction fees",
      })
    }
    if (existingProgram !== undefined && isWritable(existingProgram.role)) {
      return yield* new SvmProtocolError({
        message: `Invoked program cannot be writable: ${instruction.programAddress}`,
      })
    }
    yield* upsert(instruction.programAddress, AccountRole.READONLY)
    for (const account of instruction.accounts ?? []) {
      yield* upsert(account.address, account.role)
    }
  }

  return [...accounts.values()].toSorted((left, right) => {
    if (left.feePayer !== right.feePayer) return left.feePayer ? -1 : 1
    if (isSigner(left.role) !== isSigner(right.role)) return isSigner(left.role) ? -1 : 1
    if (isWritable(left.role) !== isWritable(right.role)) return isWritable(left.role) ? -1 : 1
    return ADDRESS_COMPARATOR(left.address, right.address)
  }) as ReadonlyArray<OrderedAccount>
})

const encodeCompiledInstruction = (
  instruction: Instruction,
  accountIndex: ReadonlyMap<Address.Address, number>,
): Effect.Effect<Uint8Array, SvmProtocolError> => {
  const programIndex = accountIndex.get(instruction.programAddress)
  if (programIndex === undefined) {
    return Effect.fail(
      new SvmProtocolError({
        message: `Missing program account: ${instruction.programAddress}`,
      }),
    )
  }
  const indices: number[] = []
  for (const account of instruction.accounts ?? []) {
    const index = accountIndex.get(account.address)
    if (index === undefined) {
      return Effect.fail(new SvmProtocolError({ message: `Missing instruction account: ${account.address}` }))
    }
    indices.push(index)
  }
  const accountIndices = Uint8Array.from(indices)
  const data = instruction.data ?? new Uint8Array()
  return Effect.succeed(
    concat(
      Uint8Array.of(programIndex),
      encodeShortU16(accountIndices.length),
      accountIndices,
      encodeShortU16(data.length),
      data,
    ),
  )
}

export const compileTransaction = Effect.fnUntraced(function* (message: TransactionMessage) {
  if (message.instructions.length > 64) {
    return yield* new SvmProtocolError({
      message: "A transaction supports at most 64 instructions",
    })
  }
  for (const [index, instruction] of message.instructions.entries()) {
    if ((instruction.accounts?.length ?? 0) > 255) {
      return yield* new SvmProtocolError({
        message: `Instruction ${index} has too many accounts`,
      })
    }
  }

  const accounts = yield* getOrderedAccounts(message.feePayer, message.instructions)
  if (accounts.length > 64) {
    return yield* new SvmProtocolError({ message: "A transaction supports at most 64 accounts" })
  }
  const signerAccounts = accounts.filter((account) => isSigner(account.role))
  if (signerAccounts.length > 12) {
    return yield* new SvmProtocolError({ message: "A transaction supports at most 12 signers" })
  }

  const accountIndex = new Map(accounts.map((account, index) => [account.address, index]))
  const compiledInstructions: Uint8Array[] = []
  for (const instruction of message.instructions) {
    compiledInstructions.push(yield* encodeCompiledInstruction(instruction, accountIndex))
  }
  const numReadonlySignerAccounts = signerAccounts.filter((account) => !isWritable(account.role)).length
  const numReadonlyNonSignerAccounts = accounts.filter(
    (account) => !isSigner(account.role) && !isWritable(account.role),
  ).length

  const messageBytes = concat(
    Uint8Array.of(0x80, signerAccounts.length, numReadonlySignerAccounts, numReadonlyNonSignerAccounts),
    encodeShortU16(accounts.length),
    ...accounts.map((account) => Address.toBytes(account.address)),
    Address.toBytes(message.lifetimeConstraint.blockhash),
    encodeShortU16(compiledInstructions.length),
    ...compiledInstructions,
    encodeShortU16(0),
  )
  const signatures = Object.fromEntries(signerAccounts.map((account) => [account.address, null])) as Record<
    Address.Address,
    Uint8Array | null
  >
  return { messageBytes, signatures } satisfies Transaction
})

export const partiallySignTransaction = Effect.fnUntraced(function* <T extends Transaction>(
  keyPairs: ReadonlyArray<CryptoKeyPair>,
  transaction: T,
) {
  const signatures: Record<Address.Address, Uint8Array | null> = { ...transaction.signatures }
  for (const keyPair of keyPairs) {
    const address = yield* Address.fromPublicKey(keyPair.publicKey)
    if (!(address in signatures)) {
      return yield* new SvmProtocolError({
        message: `Address is not required to sign this transaction: ${address}`,
      })
    }
    signatures[address] = yield* Ed25519PrivateKey.sign(
      Ed25519PrivateKey.Ed25519PrivateKey.make(keyPair.privateKey),
      transaction.messageBytes,
    )
  }
  return { ...transaction, signatures } as T
})

const getWireTransactionBytes = (transaction: Transaction) => {
  const signatures = Object.values(transaction.signatures)
  if (signatures.length === 0) {
    return Effect.fail(new SvmProtocolError({ message: "A transaction must have at least one signer" }))
  }
  const wire = concat(
    encodeShortU16(signatures.length),
    ...signatures.map((signature) => signature ?? new Uint8Array(64)),
    transaction.messageBytes,
  )
  if (wire.length > 1232) {
    return Effect.fail(new SvmProtocolError({ message: `Transaction exceeds 1232 bytes: ${wire.length}` }))
  }
  return Effect.succeed(wire)
}

export const getBase64EncodedWireTransaction = (transaction: Transaction) =>
  getWireTransactionBytes(transaction).pipe(Effect.map(Encoding.encodeBase64))
