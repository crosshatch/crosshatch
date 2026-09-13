import { assert, describe, it } from "@effect/vitest"
import { Schema as S } from "effect"
import { expectTypeOf } from "vitest"

import type * as Address from "./Address.ts"
import type * as Decimals from "./Decimals.ts"
import * as Instrument from "./Instrument.ts"
import * as Namespace from "./Namespace.ts"
import { Eip155 } from "./namespaces/Eip155/Eip155.ts"
import { Solana } from "./namespaces/Solana/Solana.ts"
import * as Representation from "./Representation.ts"
import type * as Scheme from "./Scheme.ts"
import * as Unit from "./Unit.ts"

class Token extends Representation.Class({ unit: Unit.make("USD"), symbol: "TOKEN" }) {}
class OtherToken extends Representation.Class({ unit: Unit.make("EUR"), symbol: "OTHER" }) {}

const evmAddress = `0x${"aB".repeat(20)}`
const solanaAddress = "Ab".repeat(16)
const solanaReference = "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
const spec = { reference: "1", address: evmAddress, schemeEnvelopes: [] } as const
const evm = Instrument.make(Token, Eip155)
const solana = Instrument.make(Token, Solana)

describe(import.meta.url, () => {
  it("constructs a checked deployment with typed address and literal reference", () => {
    const deployment = evm({ ...spec, decimals: 6 })
    assert.instanceOf(deployment.representation, Token)
    assert.instanceOf(deployment.namespace, Eip155)
    assert.strictEqual(deployment.reference.namespace, deployment.namespace)
    assert.strictEqual(deployment.address.namespace, deployment.namespace)
    assert.strictEqual(deployment.reference["~reference"], "1")
    assert.strictEqual(deployment.address.raw, evmAddress.toLowerCase())
    assert.strictEqual(deployment.decimals, 6)
    assert.strictEqual(Instrument.key(deployment), `eip155:1:${evmAddress.toLowerCase()}`)
    expectTypeOf(deployment).toEqualTypeOf<Instrument.Instrument<Token, Eip155, "1">>()
    expectTypeOf(deployment.address).toEqualTypeOf<Address.Address<Eip155>>()
    expectTypeOf(deployment.decimals).toEqualTypeOf<Decimals.Decimals | undefined>()
    expectTypeOf(deployment.schemeEnvelopes).toEqualTypeOf<ReadonlyArray<Scheme.SchemeEnvelope>>()
  })

  it("keeps omitted or explicitly undefined decimals unresolved and accepts boundary precision", () => {
    assert.strictEqual(evm(spec).decimals, undefined)
    assert.strictEqual(evm({ ...spec, decimals: undefined }).decimals, undefined)
    for (const decimals of [0, 255]) {
      assert.strictEqual(evm({ ...spec, decimals }).decimals, decimals)
    }
  })

  it("compares EVM addresses case-insensitively but distinguishes networks and contracts", () => {
    const deployment = evm(spec)
    assert.isTrue(Instrument.equals(deployment, evm({ ...spec, address: evmAddress.toLowerCase() })))
    assert.isFalse(Instrument.equals(deployment, evm({ ...spec, reference: "10" })))
    assert.isFalse(Instrument.equals(deployment, evm({ ...spec, address: `0x${"12".repeat(20)}` })))
    class OtherNamespace extends Namespace.Class({
      name: "other",
      address: { uniform: true, pattern: /^0x[a-fA-F0-9]{40}$/u, canonicalize: (address) => address.toLowerCase() },
      reference: { pattern: /^[1-9][0-9]*$/u },
    }) {}
    assert.isFalse(Instrument.equals(deployment, Instrument.make(Token, OtherNamespace)(spec)))
  })

  it("preserves Solana address and reference casing", () => {
    const deployment = solana({ ...spec, reference: solanaReference, address: solanaAddress })
    const other = solana({ ...spec, reference: solanaReference, address: solanaAddress.toLowerCase() })
    assert.strictEqual(deployment.address.raw, solanaAddress)
    assert.strictEqual(deployment.reference["~reference"], solanaReference)
    assert.isFalse(Instrument.equals(deployment, other))
    assert.isFalse(
      Instrument.equals(
        deployment,
        solana({ ...spec, reference: solanaReference.toLowerCase(), address: solanaAddress }),
      ),
    )
  })

  it("excludes metadata and capabilities from deployment identity", () => {
    // Only the envelope's identity is relevant here; no scheme implementation is exercised.
    const envelope: Scheme.SchemeEnvelope = {
      scheme: { namespace: new Eip155() } as unknown as Scheme.Any,
      extra: S.Struct({}),
    }
    const envelopes = [envelope]
    const deployment = Instrument.make(OtherToken, Eip155)({ ...spec, decimals: 18, schemeEnvelopes: envelopes })
    assert.isTrue(Instrument.equals(evm({ ...spec, decimals: 6 }), deployment))
    assert.strictEqual(Instrument.key(evm(spec)), Instrument.key(deployment))
    assert.strictEqual(deployment.schemeEnvelopes[0], envelope)
    envelopes.length = 0
    assert.strictEqual(deployment.schemeEnvelopes.length, 1)
    assert.isTrue(Object.isFrozen(deployment.schemeEnvelopes))
  })

  it("rejects invalid precision and representation metadata synchronously", () => {
    for (const decimals of [-1, 1.5, 256, NaN, Infinity]) {
      assert.throws(() => evm({ ...spec, decimals }), S.SchemaError)
    }
    class EmptySymbol extends Representation.Class({ unit: Unit.make("USD"), symbol: "" }) {}
    class EmptyUnit extends Representation.Class({ unit: Unit.make(""), symbol: "TOKEN" }) {}
    assert.throws(() => Instrument.make(EmptySymbol, Eip155)(spec), S.SchemaError)
    assert.throws(() => Instrument.make(EmptyUnit, Eip155)(spec), S.SchemaError)
  })

  it("rejects invalid namespaces, references and addresses before canonicalization", () => {
    class InvalidNamespace extends Namespace.Class({
      name: "INVALID",
      address: { uniform: true, pattern: /.*/u },
      reference: { pattern: /.*/u },
    }) {}
    assert.throws(() => Instrument.make(Token, InvalidNamespace)(spec), S.SchemaError)
    for (const reference of ["", "0", "01", "-1", "1:2", "1".repeat(33)]) {
      assert.throws(() => evm({ ...spec, reference }), S.SchemaError)
    }
    for (const address of ["", "0x1234", `0x${"g".repeat(40)}`, evmAddress.toUpperCase(), ` ${evmAddress}`]) {
      assert.throws(() => evm({ ...spec, address }), S.SchemaError)
    }
    for (const address of ["0".repeat(32), "O".repeat(32), "a".repeat(31), "a".repeat(45)]) {
      assert.throws(() => solana({ ...spec, reference: solanaReference, address }), S.SchemaError)
    }
    for (const reference of ["0".repeat(32), "a".repeat(31), "a".repeat(33)]) {
      assert.throws(() => solana({ ...spec, reference, address: solanaAddress }), S.SchemaError)
    }
  })

  it("looks up by network and normalized address, returning undefined for misses", () => {
    const mainnet = evm(spec)
    const otherNetwork = evm({ ...spec, reference: "10" })
    const sol = solana({ ...spec, reference: solanaReference, address: solanaAddress })
    const deployments = [mainnet, otherNetwork, sol]
    assert.strictEqual(Instrument.lookup(deployments, "eip155:1", evmAddress), mainnet)
    assert.strictEqual(Instrument.lookup(deployments, "eip155:10", evmAddress.toLowerCase()), otherNetwork)
    assert.strictEqual(Instrument.lookup(deployments, `solana:${solanaReference}`, solanaAddress), sol)
    assert.strictEqual(
      Instrument.lookup(deployments, `solana:${solanaReference}`, solanaAddress.toLowerCase()),
      undefined,
    )
    assert.strictEqual(Instrument.lookup(deployments, "eip155:100", evmAddress), undefined)
    assert.strictEqual(Instrument.lookup(deployments, "eip155:01", evmAddress), undefined)
    assert.strictEqual(Instrument.lookup(deployments, "eip155:1", `0x${"12".repeat(20)}`), undefined)
    assert.strictEqual(Instrument.lookup(deployments, "eip155:1", evmAddress.toUpperCase()), undefined)
    assert.strictEqual(Instrument.lookup([], "eip155:1", evmAddress), undefined)
  })
})
