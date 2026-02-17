import { Atom } from "@effect-atom/atom-react"
import { desc, eq, sql } from "drizzle-orm"
import { Effect } from "effect"

import type { ChatId } from "@/ids"

import { runtime } from "@/atoms/runtime"
import { Drizzle, latest } from "@/Drizzle"
import { chats } from "@/schema"

export const chatAtom = Atom.family((_chatId?: string | undefined) =>
  Atom.make({
    inflight: undefined,
    text: "",
  } as {
    text: string
    inflight: AbortController | undefined
  }).pipe(Atom.keepAlive),
)

export const chatsAtom = runtime
  .atom(latest((_) => _.select().from(chats).orderBy(desc(chats.updated))))
  .pipe(Atom.keepAlive)

export const deleteChatAtom = runtime.fn<typeof ChatId.Type>()(
  Effect.fn(function* (chatId) {
    const _ = yield* Drizzle
    return yield* Effect.tryPromise(() => _.delete(chats).where(eq(chats.id, chatId)))
  }),
)

export const renameChatAtom = runtime.fn<{
  id: typeof ChatId.Type
  title: string
}>()(
  Effect.fn(function* ({ id, title }) {
    const _ = yield* Drizzle
    return yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
  }),
)

export const chatItemsAtom = Atom.family((chatId?: typeof ChatId.Type | undefined) =>
  runtime
    .atom(
      latest((_) =>
        _.query.chatItems.findMany({
          where: chatId ? { chatId: { eq: chatId } } : { RAW: sql`1 = 0` },
        }),
      ),
    )
    .pipe(Atom.keepAlive),
)
