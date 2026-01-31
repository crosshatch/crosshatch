import { ChatControls } from "@/components/ChatControls"
import { SidebarInner } from "@/components/SidebarInner"
import { Button } from "@crosshatch/ui/components/Button"
import { Sidebar, SidebarInset, SidebarProvider, useSidebar } from "@crosshatch/ui/components/Sidebar"
import { useAtomSet } from "@effect-atom/atom-react"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { openSessionWidgetAtom } from "crosshatch"
import { Coins, PanelLeftIcon } from "lucide-react"
import { ThemeProvider } from "next-themes"

export const Route = createRootRoute({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider>
        <Sidebar collapsible="offcanvas">
          <SidebarInner />
        </Sidebar>
        <SidebarInset>
          <Header />
          <div className="relative flex flex-1 w-full h-full flex-col">
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
  const sessionButtonOnClick = useAtomSet(openSessionWidgetAtom)
  return (
    <header className="flex z-1 py-2 sticky top-0 right-0 left-0 bg-secondary/75 backdrop-blur-sm items-center border-b p-2 justify-between">
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
      <Button
        size="icon"
        className="size-11 rounded-full"
        variant="outline"
        onClick={() => sessionButtonOnClick()}
      >
        <Coins className="size-6 stroke-1" />
      </Button>
    </header>
  )
}
