import * as Namespace from "../../Namespace.ts"

export class Eip155 extends Namespace.Class({
  name: "eip155",
  address: {
    uniform: true,
    pattern: /^0x[a-fA-F0-9]{40}$/u,
    canonicalize: (address) => address.toLowerCase(),
  },
  reference: {
    pattern: /^[1-9][0-9]*$/u,
  },
}) {}
