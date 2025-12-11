import { layoutPropsCommon } from "@/lib/layout.shared"
import { createFileRoute } from "@tanstack/react-router"
import { HomeLayout } from "fumadocs-ui/layouts/home"

export const Route = createFileRoute("/")({ component: RouteComponent })

function RouteComponent() {
  return <HomeLayout {...layoutPropsCommon}>TODO</HomeLayout>
}
