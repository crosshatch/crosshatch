import { Record } from "effect"
import { Card, Cards } from "vocs"

type ArticleModule = {
  readonly frontmatter?: {
    readonly title?: string
    readonly description?: string
    readonly date?: string
  }
}

type Article = {
  readonly date: string
  readonly description: string
  readonly path: string
  readonly title: string
}

const modules = import.meta.glob<ArticleModule>("./pages/articles/*.mdx", { eager: true })

const articles = Record.toEntries(modules)
  .filter(([path]) => !path.endsWith("/index.mdx"))
  .map(([path, module]): Article => {
    const slug = path.replace(/^\.\/pages\/articles\//u, "").replace(/\.mdx$/u, "")
    const frontmatter = module.frontmatter ?? {}

    return {
      date: frontmatter.date ?? "",
      description: frontmatter.description ?? "",
      path: `/articles/${slug}`,
      title: frontmatter.title ?? slug,
    }
  })
  .toSorted((left, right) => right.date.localeCompare(left.date))

export const ArticleList = () => {
  if (articles.length === 0) return <p>No articles have been published yet.</p>

  return (
    <Cards>
      {articles.map((article) => (
        <Card key={article.path} title={article.title} description={article.description} to={article.path} />
      ))}
    </Cards>
  )
}
