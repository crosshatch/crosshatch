import { added, brandedId, ordinal, ref, updated } from "@crosshatch/drizzle"
import { Prompt } from "@effect/ai"
import { customType, index, pgTable, text, vector } from "drizzle-orm/pg-core"
import { Schema as S } from "effect"
import type { ChatIdTypeId, ChatItemIdTypeId, EmbeddingIdTypeId } from "./ids"

export const chats = pgTable("chats", {
  id: brandedId<typeof ChatIdTypeId>(),
  ordinal,
  title: text("title"),
  updated,
})

export const chatItems = pgTable("chat_items", {
  id: brandedId<typeof ChatItemIdTypeId>(),
  ordinal,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  message: customType<{
    data: Prompt.Message
    driverData: typeof Prompt.Message["Encoded"]
  }>({
    dataType: () => "jsonb",
    toDriver: S.encodeSync(Prompt.Message),
    fromDriver: S.decodeSync(Prompt.Message),
  })("message").notNull(),
  added,
})

export const embeddings = pgTable("embeddings", {
  id: brandedId<typeof EmbeddingIdTypeId>(),
  embedding: vector("embedding", { dimensions: 1536 }),
  chatItemId: ref("chat_item_id", () => chatItems.id, { onDelete: "cascade" }).notNull(),
}, (_) => [
  index("embeddings_embedding_index").using("hnsw", _.embedding.op("vector_cosine_ops")),
])
