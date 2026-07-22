/* oxlint-disable no-bitwise -- byte-level codec */
import { Effect, Encoding, flow, Record } from "effect"

import { Ed25519PrivateKey } from "../../Crypto/Crypto.ts"
import * as Address from "./Address.ts"
import * as Codec from "./Codec.ts"
import { SvmProtocolError } from "./Error.ts"
import { AccountRole, type Instruction, type TransactionMessage } from "./TransactionMessage.ts"

export interface Transaction {
  readonly messageBytes: Uint8Array
  readonly signatures: Readonly<Record<Address.Address, Uint8Array | null>>
}

interface OrderedAccount {
  readonly address: Address.Address
  readonly role: AccountRole
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

const MAX_INSTRUCTIONS = 64
const MAX_ACCOUNTS_PER_INSTRUCTION = 255
const MAX_ACCOUNTS = 64
const MAX_SIGNERS = 12
const MAX_WIRE_BYTES = 1232
const SIGNATURE_BYTES = 64

const getOrderedAccounts = Effect.fnUntraced(function* (
  feePayer: Address.Address,
  instructions: ReadonlyArray<Instruction>,
) {
  const roles = new Map<Address.Address, AccountRole>([[feePayer, AccountRole.WRITABLE_SIGNER]])
  const programs = new Set<Address.Address>()

  for (const instruction of instructions) {
    programs.add(instruction.programAddress)
    roles.set(instruction.programAddress, roles.get(instruction.programAddress) ?? AccountRole.READONLY)
    for (const account of instruction.accounts ?? []) {
      roles.set(account.address, ((roles.get(account.address) ?? AccountRole.READONLY) | account.role) as AccountRole)
    }
  }

  for (const program of programs) {
    if (program === feePayer) {
      return yield* new SvmProtocolError({ message: "An invoked program cannot pay transaction fees" })
    }
    if (isWritable(roles.get(program)!)) {
      return yield* new SvmProtocolError({ message: `Invoked program cannot be writable: ${program}` })
    }
  }

  const rank = (account: OrderedAccount) =>
    account.address === feePayer
      ? 0
      : isSigner(account.role)
        ? isWritable(account.role)
          ? 1
          : 2
        : isWritable(account.role)
          ? 3
          : 4

  return [...roles]
    .map(([address, role]) => ({ address, role }))
    .toSorted((left, right) => rank(left) - rank(right) || ADDRESS_COMPARATOR(left.address, right.address))
})

const encodeCompiledInstruction = (
  { accounts, programAddress, data: data_ }: Instruction,
  accountIndex: ReadonlyMap<Address.Address, number>,
): Uint8Array => {
  const accountIndices = Uint8Array.from((accounts ?? []).map(({ address }) => accountIndex.get(address)!))
  const data = data_ ?? new Uint8Array()

  return Codec.concat(
    Uint8Array.of(accountIndex.get(programAddress)!),
    Codec.encodeShortU16(accountIndices.length),
    accountIndices,
    Codec.encodeShortU16(data.length),
    data,
  )
}

export const compileTransaction = Effect.fnUntraced(function* ({
  instructions,
  feePayer,
  lifetimeConstraint,
}: TransactionMessage) {
  if (instructions.length > MAX_INSTRUCTIONS) {
    return yield* new SvmProtocolError({ message: `A transaction supports at most ${MAX_INSTRUCTIONS} instructions` })
  }

  const oversized = instructions.findIndex(({ accounts }) => (accounts?.length ?? 0) > MAX_ACCOUNTS_PER_INSTRUCTION)
  if (oversized !== -1) {
    return yield* new SvmProtocolError({ message: `Instruction ${oversized} has too many accounts` })
  }

  const accounts = yield* getOrderedAccounts(feePayer, instructions)
  if (accounts.length > MAX_ACCOUNTS) {
    return yield* new SvmProtocolError({ message: `A transaction supports at most ${MAX_ACCOUNTS} accounts` })
  }

  const signers = accounts.filter(({ role }) => isSigner(role))
  if (signers.length > MAX_SIGNERS) {
    return yield* new SvmProtocolError({ message: `A transaction supports at most ${MAX_SIGNERS} signers` })
  }

  const accountIndex = new Map(accounts.map(({ address }, index) => [address, index]))
  const compiledInstructions = instructions.map((instruction) => encodeCompiledInstruction(instruction, accountIndex))
  const numReadonlySigners = signers.filter(({ role }) => !isWritable(role)).length
  const numReadonlyNonSigners = accounts.filter(({ role }) => !isSigner(role) && !isWritable(role)).length

  const messageBytes = Codec.concat(
    Uint8Array.of(0x80, signers.length, numReadonlySigners, numReadonlyNonSigners),
    Codec.encodeShortU16(accounts.length),
    ...accounts.map((account) => Address.toBytes(account.address)),
    Address.toBytes(lifetimeConstraint.blockhash),
    Codec.encodeShortU16(compiledInstructions.length),
    ...compiledInstructions,
    Codec.encodeShortU16(0),
  )
  const signatures = Record.fromEntries(signers.map((account) => [account.address, null]))
  return { messageBytes, signatures }
})

export const partiallySignTransaction = Effect.fnUntraced(function* (
  keyPairs: ReadonlyArray<CryptoKeyPair>,
  transaction: Transaction,
) {
  const signatures = { ...transaction.signatures }
  for (const { privateKey, publicKey } of keyPairs) {
    const address = yield* Address.fromPublicKey(publicKey)
    if (!(address in signatures)) {
      return yield* new SvmProtocolError({ message: `Address is not required to sign this transaction: ${address}` })
    }
    signatures[address] = yield* Ed25519PrivateKey.sign(
      Ed25519PrivateKey.Ed25519PrivateKey.make(privateKey),
      transaction.messageBytes,
    )
  }
  return { ...transaction, signatures }
})

const getWireTransactionBytes = Effect.fnUntraced(function* (transaction: Transaction) {
  const signatures = Record.values(transaction.signatures).map(
    (signature) => signature ?? new Uint8Array(SIGNATURE_BYTES),
  )
  if (signatures.length === 0) {
    return yield* new SvmProtocolError({ message: "A transaction must have at least one signer" })
  }

  const wire = Codec.concat(Codec.encodeShortU16(signatures.length), ...signatures, transaction.messageBytes)
  if (wire.length > MAX_WIRE_BYTES) {
    return yield* new SvmProtocolError({ message: `Transaction exceeds ${MAX_WIRE_BYTES} bytes: ${wire.length}` })
  }

  return wire
})

export const getBase64EncodedWireTransaction = flow(getWireTransactionBytes, Effect.map(Encoding.encodeBase64))
