export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex flex-col relative h-full max-h-[calc(100vh-48px)]">
      {children}
    </div>
  )
}
