import { cn } from "../cn.ts"

export const ChatEventCard = ({ children, className, actions }: {
  children: React.ReactNode
  className?: string | undefined
  actions?: React.ReactNode | undefined
}) => (
  <div className={cn("w-full flex flex-row", className)}>
    <div className="w-2/3">
      <div className="rounded-sm border overflow-hidden">
        {children}
      </div>
      {actions && <div className="flex w-full">{actions}</div>}
    </div>
  </div>
)
