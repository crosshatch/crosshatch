import { Schema as S } from "effect"

import { NetworkFromString } from "./Network.ts"

export class Requirements extends S.Class<Requirements>("Requirements")({
  scheme: S.NonEmptyString,
  network: NetworkFromString,
  asset: S.NonEmptyString,
  amount: S.NonEmptyString,
  payTo: S.NonEmptyString,
  maxTimeoutSeconds: S.Natural,
  extra: S.JsonObject.pipe(S.optional),
}) {}
