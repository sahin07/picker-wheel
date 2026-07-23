import type { ReactNode } from "react"
import Link from "next/link"
import Footer from "@/components/footer"
import {
  ARTICLE_AUTHOR,
  ARTICLE_REVIEWER,
  ARTICLES_PATH,
  type Article,
  getRelatedArticles,
} from "@/lib/articles"

function SiteHeader({ active = "articles" }: { active?: "articles" | "help" }) {
  return (
    <header className="w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500">
            <div className="h-4 w-4 rounded-full bg-green-600" />
          </div>
          <span className="font-spin-display text-xl font-bold text-gray-800">
            Picker Wheel
          </span>
        </Link>
        <nav className="flex items-center gap-4 font-spin-display text-sm font-semibold text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link
            href={ARTICLES_PATH}
            className={active === "articles" ? "text-green-700" : "hover:text-gray-900"}
          >
            Articles
          </Link>
          <Link
            href="/help"
            className={active === "help" ? "text-green-700" : "hover:text-gray-900"}
          >
            Help
          </Link>
        </nav>
      </div>
    </header>
  )
}

function formatGuideDate(isoDate: string) {
  const date = new Date(`${isoDate}T12:00:00`)
  if (Number.isNaN(date.getTime())) return isoDate
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function ArticlePageChrome({
  article,
  children,
}: {
  article: Article
  children?: ReactNode
}) {
  const related = getRelatedArticles(article)

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <SiteHeader />
      <main className="flex-1 py-12 md:py-16">
        <article className="container mx-auto max-w-3xl px-4">
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
              <li>
                <Link href={ARTICLES_PATH} className="hover:text-green-700">
                  Articles
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-slate-800">{article.categoryLabel}</li>
            </ol>
          </nav>

          <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-green-700">
            {article.categoryLabel}
          </p>
          <h1 className="mt-2 font-spin-display text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
            {article.h1}
          </h1>

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            <p>
              <span className="font-spin-display font-semibold text-slate-800">
                By {ARTICLE_AUTHOR.name}
              </span>
              <span className="text-slate-400"> · </span>
              {ARTICLE_AUTHOR.jobTitle}
            </p>
            <p className="mt-1">
              Reviewed by{" "}
              <span className="font-semibold text-slate-800">
                {ARTICLE_REVIEWER.name}
              </span>{" "}
              for accuracy against live Picker Wheel tools.
            </p>
            <p className="mt-1 text-slate-500">
              Published {formatGuideDate(article.publishedAt)}
              <span className="text-slate-400"> · </span>
              Updated {formatGuideDate(article.updatedAt)}
            </p>
          </div>

          <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
            {article.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <aside className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
            <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-amber-900">
              From our experience testing this
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 md:text-base">
              {article.experienceNote}
            </p>
          </aside>

          <section className="mt-10 rounded-2xl border border-green-100 bg-green-50/70 p-6">
            <h2 className="font-spin-display text-2xl font-bold text-slate-800">
              How to do it on Picker Wheel
            </h2>
            <ol className="mt-4 space-y-4">
              {article.howToSteps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 font-spin-display text-sm font-bold text-white">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-spin-display font-semibold text-slate-800">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {article.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-10">
            <h2 className="font-spin-display text-2xl font-bold text-slate-800">
              Recommended Picker Wheel tools
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {article.tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-green-400 hover:bg-green-50/40"
                  >
                    <span className="font-spin-display font-semibold text-slate-900">
                      {tool.label}
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      {tool.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-spin-display text-2xl font-bold text-slate-800">
              Frequently asked questions
            </h2>
            <dl className="mt-4 space-y-3">
              {article.faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <dt className="font-spin-display font-semibold text-slate-900">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-600">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {related.length > 0 && (
            <section className="mt-10">
              <h2 className="font-spin-display text-2xl font-bold text-slate-800">
                Related articles
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {related.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-green-400"
                    >
                      <span className="text-xs font-semibold uppercase text-green-700">
                        {item.categoryLabel}
                      </span>
                      <span className="mt-1 block font-spin-display font-semibold text-slate-900">
                        {item.h1}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {children}

          <section
            id="editorial"
            className="mt-10 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-600"
          >
            <h2 className="font-spin-display text-lg font-bold text-slate-800">
              About this guide
            </h2>
            <p className="mt-2">{ARTICLE_AUTHOR.description}</p>
            <p className="mt-2">{ARTICLE_REVIEWER.description}</p>
            <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              <Link href="/help" className="font-semibold text-green-700 hover:underline">
                Help Center
              </Link>
              <Link
                href="/contact-us"
                className="font-semibold text-green-700 hover:underline"
              >
                Contact Us
              </Link>
              <Link
                href={ARTICLES_PATH}
                className="font-semibold text-green-700 hover:underline"
              >
                All articles
              </Link>
            </p>
          </section>

          <p className="mt-10 text-center text-sm text-slate-500">
            <Link href={ARTICLES_PATH} className="font-semibold text-green-700 hover:underline">
              ← All articles
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  )
}

export { SiteHeader as ArticlesSiteHeader }
