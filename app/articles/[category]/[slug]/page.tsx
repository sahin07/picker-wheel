import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArticlePageChrome } from "@/components/articles/article-page-chrome"
import {
  ARTICLE_AUTHOR,
  articleUrl,
  buildArticleSchemas,
  getAllArticleParams,
  getArticleByPath,
} from "@/lib/articles"

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export function generateStaticParams() {
  return getAllArticleParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const article = getArticleByPath(category, slug)
  if (!article) return {}
  const url = articleUrl(article)
  return {
    title: { absolute: article.title },
    description: article.description,
    keywords: [...article.keywords],
    authors: [{ name: ARTICLE_AUTHOR.name, url: ARTICLE_AUTHOR.url }],
    creator: ARTICLE_AUTHOR.name,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: "Picker Wheel",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [ARTICLE_AUTHOR.name],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
    other: {
      "article:author": ARTICLE_AUTHOR.name,
      "article:modified_time": article.updatedAt,
      "article:published_time": article.publishedAt,
      "article:section": article.categoryLabel,
      "article:tag": article.keywords.join(","),
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const article = getArticleByPath(category, slug)
  if (!article) notFound()

  const schemas = buildArticleSchemas(article)

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ArticlePageChrome article={article} />
    </>
  )
}
