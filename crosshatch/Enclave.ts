import { Prompt } from "@effect/ai"
import { Rpc, RpcGroup } from "@effect/rpc"
import type { PaymentRequirements } from "@x402/core/types"
import { Schema as S } from "effect"

export class Enclave extends RpcGroup.make(
  Rpc.make("payment", {
    payload: {
      requirements: S.Unknown as S.Schema<PaymentRequirements>,
      prompt: Prompt.Prompt.pipe(S.optional),
    },
    success: S.String,
  }),
) {}
