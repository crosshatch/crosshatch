import { chatAtom, chatItemsAtom, currentModelIdAtom, modelIdsAtom, runtime } from "@/atoms"
import { ModelSelect } from "@/components/model-select"
import { SidebarInner } from "@/components/sidebar-inner"
import { router } from "@/router"
import { chatItems, chatItemsEmbeddings, chats } from "@/schema"
import { Store } from "@/Store"
import { sessionDetailsAtom, SessionDialog, sessionDialogOpenAtom } from "@crosshatch/react"
import { Database } from "@crosshatch/store"
import * as AtomUtil from "@crosshatch/ui/AtomUtil"
import { Button } from "@crosshatch/ui/components/button"
import { ChatControls } from "@crosshatch/ui/components/chat-controls"
import { LoaderView } from "@crosshatch/ui/components/loader-view"
import { Sidebar, SidebarInset, SidebarProvider, useSidebar } from "@crosshatch/ui/components/sidebar"
import { embed, unwrapE0 } from "@crosshatch/util"
import { useAtom, useAtomSet, useAtomValue } from "@effect-atom/atom-react"
import { AiError, LanguageModel, Prompt } from "@effect/ai"
import { OpenRouterLanguageModel } from "@effect/ai-openrouter"
import { createRootRoute, Link, Outlet } from "@tanstack/react-router"
import { CrosshatchConfig } from "crosshatch"
import { eq } from "drizzle-orm"
import { ConfigError, Effect, Fiber, Layer, Match } from "effect"
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
            <SessionDialog>
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
            </SessionDialog>
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
  const open = get(sessionDialogOpenAtom)
  if (open) {
    get.set(sessionDialogOpenAtom, false)
  } else {
    const session = yield* get.result(sessionDetailsAtom)
    Match.value(session).pipe(
      Match.tags({
        Linked: () => get.set(sessionDialogOpenAtom, true),
        Blank: ({ signer }) => {
          location.href = CrosshatchConfig.toHref(
            CrosshatchConfig.make({ signer }),
          )
        },
        Revoked: () => {}, // TODO
      }),
      Match.exhaustive,
    )
  }
}))

export const submitAtom = runtime.fn<string | undefined>()(Effect.fn(function*(chatId, get) {
  // const session = yield* get.result(sessionDetailsAtom)
  // if (Option.isNone(session)) {
  //   get.set(sessionDialogOpenAtom, true)
  //   return
  // }

  let { text } = get(chatAtom(chatId))
  const items = yield* get.result(chatItemsAtom(chatId))
  text = text.trim()
  if (!text) return

  let titleFiber:
    | Fiber.RuntimeFiber<void, Database.DatabaseError | AiError.AiError | ConfigError.ConfigError>
    | undefined
  if (!chatId) {
    const id = crypto.randomUUID()
    chatId = id
    AtomUtil.assign(get)(chatAtom(undefined), { text: "" })
    yield* Effect.tryPromise(() =>
      router.navigate({
        to: "/{-$chatId}",
        params: { chatId },
      })
    )
    const _ = yield* Store._
    yield* Store.f(_.insert(chats).values({ id }))
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
      yield* Store.f(_.update(chats).set({ title }).where(eq(chats.id, id)))
    }).pipe(
      Effect.fork,
    )
  }
  const userMessage = Prompt.userMessage({
    content: [Prompt.makePart("text", { text })],
  })

  yield* Store.tx(Effect.fn(function*(_) {
    const { id: sourceId } = yield* Effect.zipLeft(
      Store.f(
        _
          .insert(chatItems).values({
            chatId,
            message: userMessage,
          })
          .returning(),
      ).pipe(unwrapE0),
      Store.f(_.update(chats).set({ updated: new Date() }).where(eq(chats.id, chatId))),
    )
    const embedding = yield* embed(text)
    yield* Store.f(
      _.insert(chatItemsEmbeddings).values({ sourceId, embedding }).returning(),
    ).pipe(
      unwrapE0,
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
  yield* Store.tx(Effect.fn(function*(_) {
    const { id: sourceId } = yield* Effect.zipLeft(
      Store.f(
        _.insert(chatItems).values({
          chatId,
          message: Prompt.assistantMessage({
            content: [Prompt.makePart("text", { text: incoming })],
          }),
        }).returning(),
      ).pipe(unwrapE0),
      Store.f(_.update(chats).set({ updated: new Date() }).where(eq(chats.id, chatId))),
    )
    const embedding = yield* embed(incoming)
    yield* Store.f(
      _.insert(chatItemsEmbeddings).values({ sourceId, embedding }).returning(),
    ).pipe(
      unwrapE0,
    )
  }))
  AtomUtil.assign(get)(chatAtom(chatId), {
    inflight: undefined,
  })
  inflight.abort()
  if (titleFiber) yield* titleFiber
}, (x, _1, get) =>
  Effect.provide(
    x,
    get.result(currentModelIdAtom).pipe(
      Effect.map((modelId) => OpenRouterLanguageModel.model(modelId)),
      Layer.unwrapEffect,
    ),
  )))
