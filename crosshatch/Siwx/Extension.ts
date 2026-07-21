import * as Extension from "../Extension.ts"
import { Challenge, Proof, SIGN_IN_WITH_X } from "./Schema.ts"

export class Siwx extends Extension.Service<Siwx>()("crosshatch/Siwx", {
  identifier: SIGN_IN_WITH_X,
  header: SIGN_IN_WITH_X,
  info: Challenge,
  enrichment: Proof,
}) {}
