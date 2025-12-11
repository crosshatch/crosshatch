import { Link } from "@tanstack/react-router"
import { MoreHorizontal } from "lucide-react"
import { ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "./sidebar"
import { Skeleton } from "./skeleton"

// TODO: get typed link params
export const MenuItem = ({
  loading,
  label,
  to,
  params,
  icon,
  more,
  external,
}: {
  loading?: boolean | undefined
  label?: string | undefined
  icon?: React.ReactNode | undefined
  more?: React.ReactNode | undefined
  external?: boolean | undefined
  to: string
  params?: Record<string, string> | undefined
}) => {
  const { isMobile } = useSidebar()
  const inner = (
    <>
      {icon}
      {<span className="font-light">{label}</span>}
      {external && <ExternalLink className="size-3! stroke-1 opacity-50" />}
    </>
  )
  return (
    <SidebarMenuItem>
      {loading ? <Skeleton className="h-8 p-0 rounded-sm" /> : (
        <>
          <SidebarMenuButton className="px-2 h-8 rounded-sm" asChild>
            {external ? <a href={to} target="_blank">{inner}</a> : (
              <Link
                {...to ? { to } : {}}
                {...params ? { params } : {}}
                activeProps={{ className: "bg-primary/15 hover:bg-primary/15!" }}
              >
                {inner}
              </Link>
            )}
          </SidebarMenuButton>
          {more && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                {more}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      )}
    </SidebarMenuItem>
  )
}
