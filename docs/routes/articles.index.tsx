import { articles } from "@/lib/source"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { PathUtils } from "fumadocs-core/source"

const getName = (path: string) => PathUtils.basename(path, PathUtils.extname(path))

const loader = createServerFn({ method: "GET" }).handler(() => {
  return [...articles.getPages()]
    .sort((a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() - new Date(a.data.date ?? getName(a.path)).getTime()
    )
    .map(({ data, url }) => ({
      url,
      title: data.title,
      date: data.date,
      description: data.description,
    }))
})

export const Route = createFileRoute("/articles/")({
  loader: () => loader(),
  component: Page,
})

function Page() {
  const posts = Route.useLoaderData()
  return (
    <main className="mx-auto w-full max-w-fd-container px-4 pb-12 md:py-12">
      <div className="relative dark mb-4 aspect-[3.2] p-8 z-2 md:p-12">
        <h1 className="mb-4 text-3xl text-landing-foreground font-mono font-medium">
          Crosshatch Articles
        </h1>
        <p className="text-sm font-mono text-landing-foreground-200">
          The latest tutorials and announcements from the Crosshatch team.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => (
          <Link
            key={post.url}
            to={post.url}
            href={post.url}
            className="flex flex-col bg-fd-card rounded-2xl border shadow-sm p-4 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground"
          >
            <p className="font-medium">{post.title}</p>
            <p className="text-sm text-fd-muted-foreground">
              {post.description}
            </p>
            <p className="mt-auto pt-4 text-xs text-brand">{new Date(post.date).toDateString()}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
