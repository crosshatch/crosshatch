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
  added,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  id: brandedId<typeof ChatItemIdTypeId>(),
  message: customType<{
    data: Prompt.Message
    driverData: typeof Prompt.Message.Encoded
  }>({
    dataType: () => "jsonb",
    fromDriver: S.decodeSync(Prompt.Message),
    toDriver: S.encodeSync(Prompt.Message),
  })("message").notNull(),
  ordinal,
})

export const embeddings = pgTable(
  "embeddings",
  {
    chatItemId: ref("chat_item_id", () => chatItems.id, { onDelete: "cascade" }).notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    id: brandedId<typeof EmbeddingIdTypeId>(),
  },
  (_) => [index("embeddings_embedding_index").using("hnsw", _.embedding.op("vector_cosine_ops"))],
)
