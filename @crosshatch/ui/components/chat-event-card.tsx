import { cn } from "../cn"

export const ChatEventCard = ({ children, className }: {
  children: React.ReactNode
  className?: string | undefined
}) => (
  <div className={cn("w-full flex flex-row", className)}>
    <div className="w-2/3 rounded-sm border overflow-hidden">
      {children}
    </div>
  </div>
)
