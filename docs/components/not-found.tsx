import { Link } from "@tanstack/react-router"
import { HomeLayout } from "fumadocs-ui/layouts/home"

export const NotFound = () => (
  <HomeLayout
    nav={{
      title: "Crosshatch Documentation",
    }}
    className="text-center py-32 justify-center"
  >
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-6xl font-bold text-fd-muted-foreground">404</h1>
      <h2 className="text-2xl font-semibold">Page Not Found</h2>
      <p className="text-fd-muted-foreground max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/docs/$">
        Back to Documentation
      </Link>
    </div>
  </HomeLayout>
)
