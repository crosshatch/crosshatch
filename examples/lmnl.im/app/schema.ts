import { added, ordinal, ref, updated } from "@crosshatch/drizzle"
import { customType, index, pgTable, text, vector, uuid } from "drizzle-orm/pg-core"
import { Schema as S } from "effect"
import { Prompt } from "effect/unstable/ai"

const id = uuid("id").primaryKey().notNull().defaultRandom()

export const chats = pgTable("chats", {
  id,
  ordinal,
  title: text("title"),
  updated,
})

export const chatItems = pgTable("chat_items", {
  added,
  chatId: ref("chat_id", () => chats.id, { onDelete: "cascade" }).notNull(),
  id,
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
    embedding: vector("embedding", { dimensions: 1536 }).$type<ReadonlyArray<number>>(),
    id,
  },
  (_) => [index("embeddings_embedding_index").using("hnsw", _.embedding.op("vector_cosine_ops"))],
)
