import { Redacted, Context, Layer, Effect } from "effect"
import { Address, Hash, Hex, Mnemonic as OxMnemonic, PersonalMessage, Secp256k1, Signature, TypedData } from "ox"

import * as Mnemonic from "../Mnemonic.ts"

export class Eip155Signer extends Context.Service<
  Eip155Signer,
  {
    readonly address: Address.Address
    readonly signMessage: (value: { readonly message: string }) => Hex.Hex | Promise<Hex.Hex>
    readonly signTypedData: <
      const typedData extends TypedData.TypedData | Record<string, unknown>,
      primaryType extends keyof typedData | "EIP712Domain",
    >(
      value: TypedData.Definition<typedData, primaryType>,
    ) => Hex.Hex
  }
>()("crosshatch/Eip155/Eip155Signer") {}

export const layerMnemonic = Layer.effect(
  Eip155Signer,
  Effect.gen(function* () {
    const mnemonic = yield* Mnemonic.Mnemonic
    const privateKey = OxMnemonic.toPrivateKey(Redacted.value(mnemonic), { as: "Hex" })
    const publicKey = Secp256k1.getPublicKey({ privateKey })
    return {
      address: Address.fromPublicKey(publicKey, { checksum: true }),
      signMessage: ({ message }: { readonly message: string }) =>
        Signature.toHex(
          Secp256k1.sign({
            extraEntropy: false,
            payload: PersonalMessage.getSignPayload(Hex.fromString(message)),
            privateKey,
          }),
        ),
      signTypedData: <
        const typedData extends TypedData.TypedData | Record<string, unknown>,
        primaryType extends keyof typedData | "EIP712Domain",
      >(
        typedData: TypedData.Definition<typedData, primaryType>,
      ) =>
        Signature.toHex(
          Secp256k1.sign({
            extraEntropy: false,
            payload: Hash.keccak256(TypedData.encode(typedData)),
            privateKey,
          }),
        ),
    }
  }),
)
