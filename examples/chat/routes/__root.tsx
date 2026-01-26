import { chatAtom, chatItemsAtom, currentModelIdAtom, modelIdsAtom, runtime } from "@/atoms"
import { ModelSelect } from "@/components/model-select"
import { SidebarInner } from "@/components/sidebar-inner"
import { Drizzle } from "@/Drizzle"
import { ChatId } from "@/ids"
import { router } from "@/router"
import { chatItems, chats, embeddings } from "@/schema"
import { tx } from "@/tx"
import { txNonNullable } from "@crosshatch/drizzle"
import { linkStateAtom } from "@crosshatch/react"
import { BridgeClient } from "@crosshatch/react"
import * as AtomUtil from "@crosshatch/ui/AtomUtil"
import { Button } from "@crosshatch/ui/components/button"
import { ChatControls } from "@crosshatch/ui/components/chat-controls"
import { LoaderView } from "@crosshatch/ui/components/loader-view"
import { Sidebar, SidebarInset, SidebarProvider, useSidebar } from "@crosshatch/ui/components/sidebar"
import { e0, embed } from "@crosshatch/util"
import { PaymentRequired } from "@crosshatch/x402"
import { useAtom, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { AiError, LanguageModel, Prompt } from "@effect/ai"
import { OpenRouterLanguageModel } from "@effect/ai-openrouter"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { dialog, homeHref, linkHref } from "crosshatch"
import { eq } from "drizzle-orm"
import { Cause, Effect, Encoding, Fiber, flow, Layer, Schema as S } from "effect"
import { FlaskRound, HandCoins, PanelLeftIcon, Plus } from "lucide-react"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import { Route as ChatRoute } from "./{-$chatId}"

export const Route = createRootRoute({
  component: RouteComponent,
})

const mockAtom = runtime.fn<void>()(Effect.fn(function*() {
  const g = yield* Effect.tryPromise(() => fetch("http://localhost:7775"))
  const paymentRequired = yield* Effect.fromNullable(g.headers.get("PAYMENT-REQUIRED"))
  const requirement = yield* Encoding.decodeBase64String(paymentRequired).pipe(
    Effect.flatMap(flow(
      JSON.parse,
      S.decodeUnknown(PaymentRequired),
    )),
  )
  const bridge = yield* BridgeClient
  const v = yield* bridge("payment", {
    requirement: requirement as never,
  })
  if (v._tag === "Approved") {
    const { payload } = v
    const payment = Encoding.encodeBase64(JSON.stringify(payload))
    const result = yield* Effect.tryPromise(() =>
      fetch("http://localhost:7775", {
        headers: {
          "PAYMENT-SIGNATURE": payment,
        },
      })
    ).pipe(
      Effect.flatMap((v) => Effect.tryPromise(() => v.json())),
    )
    console.log("HERE", result)
  }
}))

function RouteComponent() {
  const { chatId } = ChatRoute.useParams()
  const [chat, setChat] = useAtom(chatAtom(chatId))
  const submit = useAtomSet(submitAtom)
  const modelIdsResult = useAtomValue(modelIdsAtom)
  const sessionButtonOnClick = useAtomSet(sessionButtonOnClickAtom)
  const mock = useAtomSet(mockAtom)
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarInner />
        </Sidebar>
        <SidebarInset>
          <Header />
          <Suspense fallback={<LoaderView />}>
            <div className="relative flex flex-1 w-full h-full flex-col">
              <Outlet />
              <ChatControls
                {...{ chatId }}
                {...chat}
                submit={() => submit(chatId)}
                onTextChange={(text) => setChat({ ...chat, text })}
                inflight={chat.inflight}
                additionalDisabled={modelIdsResult._tag !== "Success"}
                actions={
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      className="rounded-full"
                      variant="outline"
                      onClick={() => sessionButtonOnClick()}
                    >
                      <HandCoins />
                    </Button>
                    <Button
                      size="icon"
                      className="rounded-full"
                      variant="outline"
                      onClick={() => mock()}
                    >
                      <FlaskRound />
                    </Button>
                    <ModelSelect />
                  </div>
                }
              />
            </div>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

const Header = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <header className="flex py-2 sticky top-0 right-0 left-0 bg-secondary/75 backdrop-blur-sm items-center border-b p-2 justify-between">
      <Button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        variant="outline"
        onClick={toggleSidebar}
        className="size-11"
      >
        <PanelLeftIcon className="size-7 stroke-[1.5]" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Button
        asChild
        className="shadow-none rounded-full size-11"
        variant="outline"
      >
        <Link to="/{-$chatId}" params={{ chatId: undefined }}>
          <Plus className="size-6 stroke-2" />
        </Link>
      </Button>
    </header>
  )
}

const sessionButtonOnClickAtom = runtime.fn<void>()(Effect.fn(function*(_, get) {
  const linkState = yield* get.result(linkStateAtom)
  switch (linkState._tag) {
    case "Anonymous": {
      const { challengeId } = linkState
      return yield* linkHref({
        id: challengeId,
        window: "Week",
        amount: 10,
        presentation: "Embedded",
        referrer: location.href,
      }).pipe(
        Effect.flatMap(dialog),
      )
    }
    case "Linked": {
      return yield* homeHref({
        presentation: "Embedded",
        referrer: location.href,
      }).pipe(
        Effect.flatMap(dialog),
      )
    }
  }
}))

export const submitAtom = runtime.fn<typeof ChatId.Type | undefined>()(Effect.fn(function*(chatId, get) {
  // const session = yield* get.result(sessionDetailsAtom)
  // if (Option.isNone(session)) {
  //   get.set(sessionDialogOpenAtom, true)
  //   return
  // }
  let { text } = get(chatAtom(chatId))
  const items = yield* get.result(chatItemsAtom(chatId))
  text = text.trim()
  if (!text) return
  const _ = yield* Drizzle
  let titleFiber:
    | Fiber.RuntimeFiber<void, Cause.UnknownException | AiError.AiError>
    | undefined
  if (!chatId) {
    const id = ChatId.make(crypto.randomUUID())
    chatId = id
    AtomUtil.assign(get)(chatAtom(undefined), { text: "" })
    yield* Effect.tryPromise(() =>
      router.navigate({
        to: "/{-$chatId}",
        params: { chatId },
      })
    )
    yield* Effect.tryPromise(() => _.insert(chats).values({ id }))
    titleFiber = yield* Effect.gen(function*() {
      const { text: title } = yield* LanguageModel.generateText({
        prompt: `
          I'm about to provide you with a message.
          Create a concise title for the message.
          Don't place the title inside of quotes.
          Provide just a few words in title case.

          ---

          ${text}
        `,
      })
      yield* Effect.tryPromise(() => _.update(chats).set({ title }).where(eq(chats.id, id)))
    }).pipe(
      Effect.fork,
    )
  }
  const userMessage = Prompt.userMessage({
    content: [Prompt.makePart("text", { text })],
  })
  const userMessageEmbedding = yield* embed(text)
  yield* tx(Effect.fn(function*(_) {
    const [{ id: chatItemId }] = yield* Effect.all([
      Effect.promise(() =>
        _
          .insert(chatItems).values({
            chatId,
            message: userMessage,
          })
          .returning()
      ).pipe(e0, txNonNullable),
      Effect.promise(
        () => _.update(chats).set({ updated: new Date() }).where(eq(chats.id, chatId)),
      ),
    ], { concurrency: "unbounded" })
    yield* Effect.promise(() =>
      _.insert(embeddings).values({
        chatItemId,
        embedding: userMessageEmbedding,
      })
    )
  }))

  const inflight = new AbortController()
  AtomUtil.assign(get)(chatAtom(chatId), {
    inflight,
    text: "",
  })
  const { text: incoming } = yield* LanguageModel.generateText({
    prompt: [...items.map((v) => v.message), userMessage],
  })
  const assistantMessageEmbedding = yield* embed(incoming)
  yield* tx(Effect.fn(function*(_) {
    const [{ id: chatItemId }] = yield* Effect.all([
      Effect.tryPromise(() =>
        _
          .insert(chatItems)
          .values({
            chatId,
            message: Prompt.assistantMessage({
              content: [Prompt.makePart("text", { text: incoming })],
            }),
          })
          .returning()
      ).pipe(e0, txNonNullable),
      Effect.tryPromise(() =>
        _
          .update(chats)
          .set({ updated: new Date() }).where(eq(chats.id, chatId))
      ),
    ], { concurrency: "unbounded" })
    yield* Effect.tryPromise(() =>
      _.insert(embeddings).values({
        chatItemId,
        embedding: assistantMessageEmbedding,
      })
    )
  }))
  AtomUtil.assign(get)(chatAtom(chatId), {
    inflight: undefined,
  })
  inflight.abort()
  if (titleFiber) yield* Fiber.join(titleFiber)
}, (x, _1, get) =>
  Effect.provide(
    x,
    get.result(currentModelIdAtom).pipe(
      Effect.map((modelId) => OpenRouterLanguageModel.model(modelId)),
      Layer.unwrapEffect,
    ),
  )))
