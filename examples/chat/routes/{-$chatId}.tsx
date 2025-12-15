import { LoaderView } from "@crosshatch/ui/components/loader-view"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/{-$chatId}")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoaderView />}>
      <div className="flex w-full h-full" />
    </Suspense>
  )
}
