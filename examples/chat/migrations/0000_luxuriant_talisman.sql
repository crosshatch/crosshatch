CREATE TABLE "chat_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer GENERATED ALWAYS AS IDENTITY (sequence name "chat_items_index_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"chat_id" uuid NOT NULL,
	"message" jsonb NOT NULL,
	"added" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_items_embeddings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"embedding" vector(384),
	"source" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"index" integer GENERATED ALWAYS AS IDENTITY (sequence name "chats_index_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text,
	"updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_items" ADD CONSTRAINT "chat_items_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_items_embeddings" ADD CONSTRAINT "chat_items_embeddings_source_chat_items_id_fk" FOREIGN KEY ("source") REFERENCES "public"."chat_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_items_embeddings_embeddings" ON "chat_items_embeddings" USING hnsw ("embedding" vector_cosine_ops);