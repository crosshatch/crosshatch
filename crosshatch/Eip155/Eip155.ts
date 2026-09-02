import { Namespace } from "../index.ts"
import type * as Eip155Address from "./Eip155Address.ts"

export class Eip155 extends Namespace.Service<Eip155, void, Eip155Address.Eip155Address>()("crosshatch/Eip155", {
  _tag: "eip155",
  uniform: true,
}) {}
