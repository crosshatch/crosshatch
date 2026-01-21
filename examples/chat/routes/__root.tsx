import { chatItemsAtom, currentModelIdAtom, modelIdsAtom, runtime } from "@/atoms"
import { ModelSelect } from "@/components/model-select"
import { SidebarInner } from "@/components/sidebar-inner"
import { Drizzle } from "@/Drizzle"
import { ChatId } from "@/ids"
import { router } from "@/router"
import { chatItems, chats, embeddings } from "@/schema"
import { tx } from "@/tx"
import { txNonNullable } from "@crosshatch/drizzle"
import { challengeAtom, InstallationDialog, installationDialogOpenAtom } from "@crosshatch/react"
import { chatAtom } from "@crosshatch/ui/atoms"
import * as AtomUtil from "@crosshatch/ui/AtomUtil"
import { Button } from "@crosshatch/ui/components/button"
import { ChatControls } from "@crosshatch/ui/components/chat-controls"
import { LoaderView } from "@crosshatch/ui/components/loader-view"
import { Sidebar, SidebarInset, SidebarProvider, useSidebar } from "@crosshatch/ui/components/sidebar"
import { e0, embed } from "@crosshatch/util"
import { useAtom, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { AiError, LanguageModel, Prompt } from "@effect/ai"
import { OpenRouterLanguageModel } from "@effect/ai-openrouter"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { linkHref } from "crosshatch"
import { eq } from "drizzle-orm"
import { Cause, Effect, Fiber, Layer, Option } from "effect"
import { HandCoins, PanelLeftIcon, Plus } from "lucide-react"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import { Route as ChatRoute } from "./{-$chatId}"

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent() {
  const { chatId } = ChatRoute.useParams()
  const [chat, setChat] = useAtom(chatAtom(chatId))
  const submit = useAtomSet(submitAtom)
  const modelIdsResult = useAtomValue(modelIdsAtom)
  const sessionButtonOnClick = useAtomSet(sessionButtonOnClickAtom)
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarInner />
        </Sidebar>
        <SidebarInset>
          <Header />
          <Suspense fallback={<LoaderView />}>
            <InstallationDialog>
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
                      <ModelSelect />
                    </div>
                  }
                />
              </div>
            </InstallationDialog>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

const Header = () => {
  const { toggleSidebar } = useSidebar()
  return (
    <header className="flex py-2 sticky top-0 right-0 left-0 bg-secondary/75 backdrop-blur-sm items-center border-b p-2 z-50 justify-between">
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
  const open = get(installationDialogOpenAtom)
  if (open) {
    get.set(installationDialogOpenAtom, false)
  } else {
    const challenge = yield* get.result(challengeAtom)
    yield* Option.match(challenge, {
      onSome: ({ id }) =>
        linkHref({
          id,
          window: "Week",
          amount: 10,
          presentation: "Redirect",
          referrer: location.href,
        }).pipe(Effect.andThen((v) => {
          location.href = v
        })),
      onNone: () =>
        Effect.sync(() => {
          get.set(installationDialogOpenAtom, true)
        }),
    })
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
