import { Button } from "@crosshatch/ui/components/Button"
import { Sidebar, SidebarInset, SidebarProvider, useSidebar } from "@crosshatch/ui/components/Sidebar"
import { useAtomSet } from "@effect/atom-react"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { openAtom } from "crosshatch"
import { PanelLeftIcon, WalletMinimal } from "lucide-react"
import { ThemeProvider } from "next-themes"

import { ChatControls } from "@/components/ChatControls"
import { SidebarInner } from "@/components/SidebarInner"

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarInner />
        </Sidebar>
        <SidebarInset>
          <Header />
          <div className="relative flex h-full w-full flex-1 flex-col">
            <Outlet />
            <ChatControls />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

const Header = () => {
  const { toggleSidebar } = useSidebar()
  const sessionButtonOnClick = useAtomSet(openAtom)
  return (
    <header className="sticky top-0 right-0 left-0 z-1 flex items-center justify-between border-b bg-secondary/75 p-2 py-2 backdrop-blur-sm">
      <Button
        data-sidebar="trigger"
        data-slot="sidebar-trigger"
        variant="outline"
        onClick={toggleSidebar}
        className="size-11"
      >
        <PanelLeftIcon className="size-7 stroke-1" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>
      <Button size="icon" className="size-11" variant="outline" onClick={() => sessionButtonOnClick()}>
        <WalletMinimal className="size-7 stroke-1" />
      </Button>
    </header>
  )
}
