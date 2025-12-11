import { PanelLeftIcon } from "lucide-react"
import { cn } from "../cn"
import { Button } from "./button"
import { useSidebar } from "./sidebar"

export const Header = ({ className, right }: {
  className?: string | undefined
  right?: React.ReactNode | undefined
}) => {
  const { toggleSidebar } = useSidebar()
  return (
    <header
      className={cn(
        "flex py-2 sticky top-0 right-0 left-0 bg-secondary/75 backdrop-blur-sm items-center border-b p-2 z-50",
        right && "justify-between",
        className,
      )}
    >
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
      {right}
    </header>
  )
}
