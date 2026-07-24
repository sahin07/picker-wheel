import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/footer"
import { ArticlesSiteHeader } from "@/components/articles/article-page-chrome"
import {
  ARTICLE_AUTHOR,
  ARTICLE_CATEGORIES,
  ARTICLE_REVIEWER,
  ARTICLES,
  ARTICLES_URL,
  getArticlesByCategory,
} from "@/lib/articles"
import { HOME_OG_IMAGE_URL, HOME_SITE_URL } from "@/lib/home-seo"

const PAGE_TITLE = "Picker Wheel Articles | Guides for Spin Wheels & Random Pickers"
const PAGE_DESCRIPTION =
  "Read free guides on spin wheels for board games, classrooms, giveaways, gaming RNG, anime challenges, teams, and fair randomness—with links to live Picker Wheel tools."

export const metadata: Metadata = {
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESCRIPTION,
  alternates: { canonical: ARTICLES_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: ARTICLES_URL,
    siteName: "Spinifywheel",
    type: "website",
    images: [
      { url: HOME_OG_IMAGE_URL, width: 1200, height: 630, alt: PAGE_TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
  },
}

export default function ArticlesHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: ARTICLES_URL,
    isPartOf: { "@type": "WebSite", name: "Picker Wheel", url: HOME_SITE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ARTICLES.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: article.h1,
        url: `${HOME_SITE_URL}${article.path}`,
      })),
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticlesSiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 font-spin-display text-sm font-semibold text-slate-500"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-green-700">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-800">Articles</li>
            </ol>
          </nav>

          <div className="mb-12 text-center">
            <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-green-700">
              Guides
            </p>
            <h1 className="mt-2 font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
              Picker Wheel Articles
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-slate-500 md:text-lg">
              Practical guides for spin wheels and random pickers—classroom tips,
              giveaways, gaming challenges, and how fair odds work—each linked to
              live tools you can open in one click.
            </p>
            <p
              id="editorial"
              className="mx-auto mt-4 max-w-2xl text-sm text-slate-500"
            >
              Written by {ARTICLE_AUTHOR.name} ({ARTICLE_AUTHOR.jobTitle}) and
              reviewed by {ARTICLE_REVIEWER.name} against live Picker Wheel
              features. Questions?{" "}
              <Link href="/contact-us" className="font-semibold text-green-700 hover:underline">
                Contact us
              </Link>{" "}
              or visit the{" "}
              <Link href="/help" className="font-semibold text-green-700 hover:underline">
                Help Center
              </Link>
              .
            </p>
          </div>

          <div className="space-y-10">
            {ARTICLE_CATEGORIES.map((category) => {
              const posts = getArticlesByCategory(category.id)
              if (!posts.length) return null
              return (
                <section key={category.id} id={category.id}>
                  <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                    {category.label}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{category.description}</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {posts.map((post) => (
                      <li key={post.path}>
                        <Link
                          href={post.path}
                          className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-green-400 hover:bg-green-50/40"
                        >
                          <span className="font-spin-display text-lg font-semibold text-slate-900">
                            {post.h1}
                          </span>
                          <span className="mt-2 block text-sm leading-relaxed text-slate-600">
                            {post.description}
                          </span>
                          <span className="mt-3 inline-block text-xs font-semibold text-green-700">
                            Read guide →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">
            Looking for a tool instead?{" "}
            <Link href="/spin-wheels" className="font-semibold text-green-700 hover:underline">
              Browse all wheel categories
            </Link>{" "}
            or visit the{" "}
            <Link href="/help" className="font-semibold text-green-700 hover:underline">
              Help Center
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
