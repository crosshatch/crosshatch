export {}

// import type { AccountAddress } from "@crosshatch/caip"
// import { Payload, Required, Requirements } from "@crosshatch/x402"
// import { Effect, String, Context } from "effect"

// import { BASE_USDC, Micros, toX402 } from "../Micros.ts"
// import { PaymentMetadataPartInput } from "../PaymentMetadataPartInput.ts"
// import { Settlement } from "../Settlement.ts"
// import { Treasury } from "../Treasury.ts"
// import { PaymentBridge, take } from "./PaymentBridge.ts"

// export interface BillConfig {
//   readonly url: string
//   readonly description: string
//   readonly amount: typeof Micros.Type
//   readonly rebate?: boolean | undefined
// }

// export class Bill extends Context.Service<
//   Bill,
//   {
//     readonly config: BillConfig
//     readonly items: Array<typeof PaymentMetadataPartInput.Type>
//   }
// >()("crosshatch/Bill") {}

// export const execute =
//   (config: BillConfig) =>
//   <A, E, R>(effect: Effect.Effect<A, E, R>) =>
//     Effect.gen(function* () {
//       const {
//         config: { url, description, amount, rebate },
//         items,
//       } = yield* Bill
//       const treasury = yield* Treasury
//       const { ingest } = yield* PaymentBridge
//       const { from, payload } = yield* take({
//         url,
//         description,
//         amount,
//         recipient: treasury,
//       })
//       const tx = yield* settle(payload)
//       const result = yield* Effect.provideService(effect, Bill, { config, items })
//       yield* ingest(items)
//       return result
//     })

// export const settle = Effect.gen(function* () {
//   const {
//     config: { deposit },
//     items,
//   } = yield* Bill
//   if (deposit) {
//     const rebateAmount = items.reduce((total, { claimed }) => (claimed ? total - claimed : total), deposit.amount)
//     if (rebateAmount > 0n) {
//       const { address } = yield* Treasury
//       const rebatePayload = yield* Payload.make(
//         signer,
//         Required.Required.make({
//           x402Version: 2,
//           accepts: [
//             Requirements.Requirements.make({
//               amount: toX402(rebateAmount, BASE_USDC),
//               asset: BASE_USDC.asset,
//               extra: {
//                 name: "USDC",
//                 version: "2",
//               },
//               maxTimeoutSeconds: 60,
//               network: BASE_USDC.network,
//               payTo: depositor,
//               scheme: "exact",
//             }),
//           ],
//           resource: { url, description: `Rebate for ${billId}` },
//         }),
//       )
//       yield* settle(rebatePayload)
//     }
//   }
// })

// export const exec =
//   ({
//     title,
//     deposit,
//     url,
//     rebate,
//   }: {
//     readonly title: string
//     readonly deposit: typeof Micros.Type
//     readonly url: string
//     readonly rebate: typeof AccountAddress.Type
//   }) =>
//   (template: TemplateStringsArray, ...substitutions: ReadonlyArray<unknown>) =>
//   <A, E, R>(effect: Effect.Effect<A, E, R>) =>
//     Effect.gen(function* () {
//       const { payload: depositPayload, from: depositor } = yield* take({
//         url,
//         description: `deposit for ${billId}`,
//         amount: deposit,
//       })
//       const { settle } = yield* Settlement
//       const tx = yield* settle(depositPayload)
//       const init: typeof BillDescription.Type = {
//         _tag: "Bill",
//         deposit: { amount: deposit, tx },
//         title,
//         description: String.stripMargin(globalThis.String.raw(template, substitutions)),
//         items: [],
//       }
//       const result = yield* Effect.provideService(effect, Bill, init)
//       yield* settle(init)
//       return result
//     })
