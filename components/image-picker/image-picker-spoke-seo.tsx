import Link from "next/link"
import { IMAGE_PICKER_PATH } from "@/lib/image-picker-seo"
import {
  getImageSpokeSiblings,
  type ImagePickerSpokeSeo,
} from "@/lib/image-picker-spokes"

export function ImagePickerSpokeSeoIntro({ spoke }: { spoke: ImagePickerSpokeSeo }) {
  return (
    <section
      aria-labelledby="image-spoke-seo-h1"
      className="mx-auto mb-10 max-w-5xl scroll-mt-24 border-t border-slate-200 px-1 pt-10 text-slate-700"
    >
      <h1
        id="image-spoke-seo-h1"
        className="font-spin-display mb-4 text-center text-3xl font-bold text-slate-900 sm:text-4xl"
      >
        {spoke.h1}
      </h1>
      <p className="mx-auto max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg">
        {spoke.heroIntro}
      </p>
      <p className="mt-3 text-center text-sm text-slate-500">
        Audience: {spoke.audience} ·{" "}
        <Link
          href={IMAGE_PICKER_PATH}
          className="text-emerald-700 underline-offset-2 hover:underline"
        >
          Back to Image Picker Wheel
        </Link>
      </p>
    </section>
  )
}

export function ImagePickerSpokeSeoSections({ spoke }: { spoke: ImagePickerSpokeSeo }) {
  const siblings = getImageSpokeSiblings(spoke)
  const toc = [
    { id: "ip-spoke-guide", label: "Guide" },
    { id: "ip-spoke-unique", label: spoke.uniqueSection.title },
    { id: "ip-spoke-cluster", label: "Related image wheels" },
    { id: "ip-spoke-faq", label: "FAQ" },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-16 px-1 pb-8 pt-4 text-slate-700">
      <article id="image-spoke-article" className="border-t border-slate-200 pt-12">
        <p className="font-spin-display mb-6 text-center text-sm font-semibold uppercase tracking-wide text-emerald-700">
          Image wheel guide
        </p>
        <nav
          id="ip-spoke-toc"
          aria-label="On this page"
          className="mb-10 rounded-xl border border-slate-200 bg-slate-50/80 p-4"
        >
          <p className="font-spin-display mb-2 text-sm font-semibold text-slate-900">On this page</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm marker:text-emerald-700">
            {toc.map((item) => (
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

        <section id="ip-spoke-guide" aria-labelledby="ip-spoke-guide-heading" className="scroll-mt-24">
          <h2
            id="ip-spoke-guide-heading"
            className="font-spin-display mb-4 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.articleTitle}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-slate-600">
            {spoke.articleIntro.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            The template above is already loaded. Upload more pictures, shuffle, save in My Wheels, or
            open the main{" "}
            <Link
              href={IMAGE_PICKER_PATH}
              className="text-emerald-700 underline-offset-2 hover:underline"
            >
              Image Picker Wheel
            </Link>{" "}
            for every template in one place.
          </p>
        </section>

        <section
          id="ip-spoke-unique"
          aria-labelledby="ip-spoke-unique-heading"
          className="mt-12 scroll-mt-24"
        >
          <h2
            id="ip-spoke-unique-heading"
            className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {spoke.uniqueSection.title}
          </h2>
          <p className="text-base leading-relaxed text-slate-600">{spoke.uniqueSection.body}</p>
        </section>
      </article>

      <section
        id="ip-spoke-cluster"
        aria-labelledby="ip-spoke-cluster-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="ip-spoke-cluster-heading"
          className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Related Image Wheels
        </h2>
        <p className="mb-6 text-base leading-relaxed text-slate-600">
          Explore more picture templates in this Image Picker Wheel cluster.
        </p>
        <ul className="flex flex-wrap gap-2">
          {siblings.map((sibling) => (
            <li key={sibling.id}>
              <Link
                href={sibling.path}
                className="inline-block rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50"
              >
                {sibling.h1}
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
      </section>

      <section
        id="ip-spoke-faq"
        aria-labelledby="ip-spoke-faq-heading"
        className="scroll-mt-24 border-t border-slate-200 pt-12"
      >
        <h2
          id="ip-spoke-faq-heading"
          className="font-spin-display mb-6 text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Frequently Asked Questions
        </h2>
        <dl className="space-y-4">
          {spoke.faq.map((item) => (
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
