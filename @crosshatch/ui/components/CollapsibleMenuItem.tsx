import { ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./Collapsible.tsx"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./Sidebar.tsx"

export const CollapsibleMenuItem = ({ label, isActive, icon, items }: {
  label: string
  isActive?: boolean | undefined
  icon: React.ReactNode
  items?:
    | Array<{
      label: string
      url: string
    }>
    | undefined
}) => (
  <Collapsible
    key={label}
    asChild
    defaultOpen={isActive ?? false}
    className="group/collapsible"
  >
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip={label}>
          {icon}
          <span>{label}</span>
          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuSub>
          {items?.map(({ url, label }) => (
            <SidebarMenuSubItem key={label}>
              <SidebarMenuSubButton asChild>
                <a href={url}>
                  <span>{label}</span>
                </a>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
)
