import Link from "next/link"
import {
  HOME_ARTICLE_INTRO,
  HOME_ARTICLE_TITLE,
  HOME_CUSTOMIZE_STEPS,
  HOME_FAQ_ITEMS,
  HOME_FEATURES_REAL,
  HOME_H1,
  HOME_HERO_INTRO,
  HOME_HOW_IT_WORKS,
  HOME_ON_THIS_PAGE,
  HOME_POPULAR_CATEGORIES,
  HOME_POPULAR_WHEELS,
  HOME_QUICK_FEATURES,
  HOME_RELATED_TOOLS,
  HOME_USE_CASES,
  HOME_USE_CASES_DETAILED,
  HOME_WHATS_ON_WHEEL,
  HOME_WHY_POINTS,
} from "@/lib/home-seo"

/** SEO H1 + pitch — below the wheel, above Quick Templates */
export function HomeSeoIntro() {
  return (
    <section
      aria-labelledby="home-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="home-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {HOME_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {HOME_HERO_INTRO}
      </p>
    </section>
  )
}

/** Discovery blocks restored from before the long-form article */
function HomeDiscoverySections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-4 pt-4 text-slate-700">
      <section aria-labelledby="home-quick-features" className="scroll-mt-24">
        <h2
          id="home-quick-features"
          className="font-spin-display mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Spin the Wheel in Seconds
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          Our random name wheel picker is built for instant decisions: add options, spin the wheel, and
          get a fair result for classrooms, giveaways, teams, and everyday choices.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_QUICK_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm"
            >
              <h3 className="font-spin-display mb-2 text-lg font-semibold text-emerald-800">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="home-popular-wheels" className="scroll-mt-24">
        <h2
          id="home-popular-wheels"
          className="font-spin-display mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Random Wheels
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          Jump into ready-made wheel pickers—or stay on this page to create your own custom spin
          wheel with names, prizes, and ideas.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_POPULAR_WHEELS.map((wheel) => (
            <li key={wheel.href + wheel.label}>
              <Link
                href={wheel.href}
                className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  {wheel.label}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                  {wheel.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="home-popular-categories" className="scroll-mt-24">
        <h2
          id="home-popular-categories"
          className="font-spin-display mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Popular Categories
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          Browse by use case—giveaways, classrooms, gaming, sports, and more—then open a matching
          spin the wheel tool.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_POPULAR_CATEGORIES.map((category) => (
            <li key={category.label}>
              <Link
                href={category.href}
                className="block h-full rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4 transition-colors hover:border-emerald-300"
              >
                <span className="font-spin-display block text-base font-semibold text-slate-900">
                  {category.label}
                </span>
                <span className="mt-1 block text-sm text-slate-600">{category.description}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-sm text-slate-500">
          See the full directory on{" "}
          <Link href="/spin-wheels/all-wheels" className="font-semibold text-emerald-700 underline">
            All Wheels
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="home-how-it-works" className="scroll-mt-24">
        <h2
          id="home-how-it-works"
          className="font-spin-display mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          How the Random Wheel Works
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          From blank list to winner in four steps—ideal when you need a wheel to spin for names,
          prizes, or quick decisions.
        </p>
        <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {HOME_HOW_IT_WORKS.map((item) => (
            <li
              key={item.step}
              className="flex gap-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
            >
              <span className="font-spin-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white">
                {item.step}
              </span>
              <div>
                <h3 className="font-spin-display text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="home-why-use" className="scroll-mt-24">
        <h2
          id="home-why-use"
          className="font-spin-display mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Why Use Our Wheel Picker?
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          Built for people who need a reliable wheel spinner online—not vague claims, just practical
          tools for fair picks.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {HOME_WHY_POINTS.map((point) => (
            <li key={point.title} className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-spin-display text-lg font-semibold text-emerald-800">
                {point.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{point.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="home-situations" className="scroll-mt-24">
        <h2
          id="home-situations"
          className="font-spin-display mb-3 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Create Your Own Custom Wheel for Any Situation
        </h2>
        <p className="mx-auto mb-8 max-w-3xl text-center text-base leading-relaxed text-slate-600">
          A flexible decision wheel covers long-tail needs—from classroom helpers to prize drawings
          and family games.
        </p>
        <ul className="mx-auto grid max-w-4xl gap-2 sm:grid-cols-2">
          {HOME_USE_CASES.map((useCase) => (
            <li
              key={useCase}
              className="rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700"
            >
              {useCase}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/**
 * Mini landing article for the home Random Name Wheel Picker:
 * context → what’s on the wheel → features → use cases → customize → related → FAQ
 */
function HomeArticleSections() {
  return (
    <article
      id="home-article"
      className="mx-auto max-w-3xl border-t border-slate-200 px-1 pb-8 pt-12 text-slate-700"
    >
      <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
        Complete guide
      </p>
      <nav
        id="home-toc"
        aria-label="On this page"
        className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
      >
        <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
          On this page
        </p>
        <ol className="flex list-decimal flex-wrap gap-x-4 gap-y-1 pl-5 text-sm marker:text-emerald-700">
          {HOME_ON_THIS_PAGE.map((item) => (
            <li key={item.id} className="marker:font-semibold">
              <a
                href={`#${item.id}`}
                className="text-emerald-700 underline-offset-2 hover:underline"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="home-article-context" aria-labelledby="home-article-title" className="scroll-mt-24">
        <h2
          id="home-article-title"
          className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          {HOME_ARTICLE_TITLE}
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-slate-600">
          {HOME_ARTICLE_INTRO.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="home-whats-on-wheel" aria-labelledby="home-whats-heading" className="mt-12 scroll-mt-24">
        <h3
          id="home-whats-heading"
          className="font-spin-display mb-3 text-xl font-bold text-slate-900 sm:text-2xl"
        >
          What you can put on the wheel
        </h3>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
          {HOME_WHATS_ON_WHEEL.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="home-features" aria-labelledby="home-features-heading" className="mt-12 scroll-mt-24">
        <h3
          id="home-features-heading"
          className="font-spin-display mb-3 text-xl font-bold text-slate-900 sm:text-2xl"
        >
          Features that work on this page
        </h3>
        <dl className="mt-6 space-y-5">
          {HOME_FEATURES_REAL.map((feature) => (
            <div key={feature.title}>
              <dt className="font-spin-display font-semibold text-slate-900">{feature.title}</dt>
              <dd className="mt-1 text-base leading-relaxed text-slate-600">{feature.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="home-use-cases" aria-labelledby="home-use-cases-heading" className="mt-12 scroll-mt-24">
        <h3
          id="home-use-cases-heading"
          className="font-spin-display mb-3 text-xl font-bold text-slate-900 sm:text-2xl"
        >
          Best ways to use the Random Name Wheel Picker
        </h3>
        <dl className="mt-6 space-y-5">
          {HOME_USE_CASES_DETAILED.map((item) => (
            <div key={item.title}>
              <dt className="font-spin-display font-semibold text-slate-900">{item.title}</dt>
              <dd className="mt-1 text-base leading-relaxed text-slate-600">{item.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="home-customize" aria-labelledby="home-customize-heading" className="mt-12 scroll-mt-24">
        <h3
          id="home-customize-heading"
          className="font-spin-display mb-3 text-xl font-bold text-slate-900 sm:text-2xl"
        >
          How to customize your spin wheel
        </h3>
        <ol className="mt-6 space-y-5">
          {HOME_CUSTOMIZE_STEPS.map((item) => (
            <li key={item.step} className="flex gap-4">
              <span className="font-spin-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <div>
                <p className="font-spin-display font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-base leading-relaxed text-slate-600">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section
        id="home-related-tools"
        aria-labelledby="home-related-heading"
        className="mt-12 scroll-mt-24"
      >
        <h3
          id="home-related-heading"
          className="font-spin-display mb-3 text-xl font-bold text-slate-900 sm:text-2xl"
        >
          Related Random Picker Wheels
        </h3>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Stay on this page for any custom list—or open a specialized spinner when you already know
          the dataset.
        </p>
        <ul className="space-y-3">
          {HOME_RELATED_TOOLS.map((tool) => (
            <li key={tool.href + tool.label}>
              <Link
                href={tool.href}
                className="font-spin-display font-semibold text-emerald-800 underline-offset-2 hover:underline"
              >
                {tool.label}
              </Link>
              <span className="text-slate-600"> — {tool.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="home-faq" aria-labelledby="home-faq-heading" className="mt-12 scroll-mt-24">
        <h2
          id="home-faq-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Common questions about Random Name Wheel Picker
        </h2>
        <div className="mt-6 space-y-3">
          {HOME_FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-slate-200 bg-white px-4 py-3 open:border-emerald-200 open:bg-emerald-50/30"
            >
              <summary className="cursor-pointer list-none marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-start justify-between gap-3">
                  <h3 className="font-spin-display text-base font-semibold text-slate-900">
                    {item.question}
                  </h3>
                  <span className="shrink-0 text-emerald-600 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-slate-500">
          More help:{" "}
          <Link href="/help" className="font-semibold text-emerald-700 underline">
            Help FAQ
          </Link>
          .
        </p>
      </section>
    </article>
  )
}

export default function HomeSeoSections() {
  return (
    <>
      <HomeDiscoverySections />
      <HomeArticleSections />
    </>
  )
}
