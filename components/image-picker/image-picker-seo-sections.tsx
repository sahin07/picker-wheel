import Link from "next/link"
import {
  IMAGE_PICKER_ARTICLE_INTRO,
  IMAGE_PICKER_ARTICLE_TITLE,
  IMAGE_PICKER_CLUSTER_LINKS,
  IMAGE_PICKER_COMPARISON,
  IMAGE_PICKER_CUSTOMIZE_POINTS,
  IMAGE_PICKER_FAQ_ITEMS,
  IMAGE_PICKER_H1,
  IMAGE_PICKER_HERO_INTRO,
  IMAGE_PICKER_ON_THIS_PAGE,
  IMAGE_PICKER_PATH,
  IMAGE_PICKER_RELATED_TOOLS,
  IMAGE_PICKER_UPLOAD_POINTS,
  IMAGE_PICKER_USE_CASE_GROUPS,
  IMAGE_PICKER_WHY_POINTS,
} from "@/lib/image-picker-seo"

/** SEO H1 + pitch — below the tool */
export function ImagePickerSeoIntro() {
  return (
    <section
      aria-labelledby="image-picker-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="image-picker-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {IMAGE_PICKER_H1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {IMAGE_PICKER_HERO_INTRO}
      </p>
    </section>
  )
}

export default function ImagePickerSeoSections() {
  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="image-picker-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Complete guide
        </p>
        <nav
          id="ip-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">
            On this page
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {IMAGE_PICKER_ON_THIS_PAGE.map((item) => (
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

        <section id="ip-spin-wheel" aria-labelledby="ip-spin-heading" className="scroll-mt-24">
          <h2
            id="ip-spin-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {IMAGE_PICKER_ARTICLE_TITLE}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {IMAGE_PICKER_ARTICLE_INTRO.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Ready to spin? Use the Image Picker Wheel above to upload pictures and spin, or tap a
            template in the{" "}
            <a href="#ip-popular" className="text-emerald-700 underline-offset-2 hover:underline">
              <strong className="font-semibold text-slate-800">Popular Image Wheels</strong>
            </a>{" "}
            strip under the title to load a ready-made picture set on the spinner. This page stays
            focused on{" "}
            <strong className="font-semibold text-slate-800">random image selection</strong>—not
            extracting colors from a photo.
          </p>
        </section>

        <section id="ip-upload" aria-labelledby="ip-upload-heading" className="mt-12 scroll-mt-24">
          <h2
            id="ip-upload-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Upload Your Own Images
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Build a custom picture wheel in minutes. Add the visuals that match your activity—then
            enable, disable, or remove slices before you spin.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2">
            {IMAGE_PICKER_UPLOAD_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-emerald-100 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-emerald-800">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="ip-customize"
          aria-labelledby="ip-customize-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ip-customize-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            Customize Your Image Wheel
          </h2>
          <p className="mb-6 text-base leading-relaxed text-slate-600">
            Make the spinner yours. Rename entries, restyle segments, shuffle the list, save the
            setup in My Wheels, and share results when others need the same visual picker.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {IMAGE_PICKER_CUSTOMIZE_POINTS.map((point) => (
              <li
                key={point.title}
                className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-sm"
              >
                <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </article>

      <section
        id="ip-use-cases"
        aria-labelledby="ip-use-cases-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="ip-use-cases-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Common Ways to Use an Image Picker Wheel
        </h2>
        <p className="mb-8 text-base leading-relaxed text-slate-600">
          From vocabulary warm-ups to character drafts and product brainstorms, a random picture
          picker keeps visual decisions fair and fun.
        </p>
        <div className="space-y-8">
          {IMAGE_PICKER_USE_CASE_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-spin-display mb-3 text-xl font-semibold text-slate-900">
                {group.title}
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.title}>
                    <Link
                      href={item.href}
                      className="block h-full rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                    >
                      <span className="font-spin-display block text-sm font-semibold text-slate-900">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-slate-600">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="ip-why" aria-labelledby="ip-why-heading" className="scroll-mt-24 border-t border-slate-200 pt-12">
        <h2
          id="ip-why-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Why Use Images Instead of Text?
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          A picture wheel is not just a name picker with decorations. Images change how people
          understand the options—especially for kids, ESL learners, and live game audiences.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {IMAGE_PICKER_WHY_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5"
            >
              <h3 className="font-spin-display mb-2 text-lg font-semibold text-slate-900">
                {point.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{point.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="ip-vs-name"
        aria-labelledby="ip-vs-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="ip-vs-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Image Picker Wheel vs Name Picker
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Both tools make fair random choices. Choose an Image Picker Wheel when the options are
          visual; use a Name Picker when the options are text names or written labels.
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[320px] text-left text-sm">
            <caption className="sr-only">
              Comparison of Image Picker Wheel and Name Picker
            </caption>
            <thead className="bg-slate-50 text-slate-900">
              <tr>
                <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                  Aspect
                </th>
                <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                  Image Picker Wheel
                </th>
                <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                  Name Picker
                </th>
              </tr>
            </thead>
            <tbody>
              {IMAGE_PICKER_COMPARISON.map((row) => (
                <tr key={row.aspect} className="border-t border-slate-100">
                  <th scope="row" className="px-4 py-3 font-medium text-slate-800">
                    {row.aspect}
                  </th>
                  <td className="px-4 py-3 text-slate-600">{row.image}</td>
                  <td className="px-4 py-3 text-slate-600">{row.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        id="ip-related"
        aria-labelledby="ip-related-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="ip-related-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Related Tools
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Looking for colors, names, numbers, letters, or countries? Those topics have dedicated
          tools. Keep this Image Picker Wheel focused on spinning pictures—not color extraction from
          images. Ready-made picture templates live in Popular Image Wheels under the title.
        </p>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {IMAGE_PICKER_RELATED_TOOLS.map((tool) => (
            <li key={tool.href + tool.label}>
              <Link
                href={tool.href}
                className="block h-full rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
              >
                <span className="font-spin-display block text-sm font-semibold text-slate-900">
                  {tool.label}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                  {tool.description}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <h3 className="font-spin-display mb-3 text-lg font-semibold text-slate-900">
            More image wheel templates
          </h3>
          <p className="mb-3 text-sm leading-relaxed text-slate-600">
            Each template opens its own page with that picture set preloaded. Pokémon, Country, and
            Fortnite open their live tools.
          </p>
          <ul className="flex flex-wrap gap-2">
            {IMAGE_PICKER_CLUSTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={IMAGE_PICKER_PATH}
                className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
              >
                Image Picker Wheel (pillar)
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section id="ip-faq" aria-labelledby="ip-faq-heading" className="scroll-mt-24 border-t border-slate-200 pt-12">
        <h2
          id="ip-faq-heading"
          className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {IMAGE_PICKER_FAQ_ITEMS.map((item) => (
            <div
              key={item.question}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <dt className="font-spin-display text-base font-semibold text-slate-900">
                {item.question}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-slate-600">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
