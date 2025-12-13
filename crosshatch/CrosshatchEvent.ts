import { Prompt } from "@effect/ai"
import { Schema as S } from "effect"

export type PaidEvent = typeof PaidEvent["Type"]
export const PaidEvent = S.TaggedStruct("PaidEvent", {
  id: S.String,
  date: S.DateFromString,
  service: S.String,
  metric: S.String,
  quantity: S.Number,
  rate: S.Number,
  charge: S.Number,
  description: S.String,
  currency: S.String,
  network: S.String,
  address: S.String,
})

export const UserMessagedEvent = S.TaggedStruct("UserMessaged", {
  id: S.String,
  message: Prompt.UserMessage,
})

export type CrosshatchEvent = typeof CrosshatchEvent["Type"]
export const CrosshatchEvent = S.Union(
  PaidEvent,
  UserMessagedEvent,
)
