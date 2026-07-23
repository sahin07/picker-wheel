type StepItem = { step: number; title: string; description: string }
type FeatureItem = { title: string; description: string }
type ComparisonRow = { aspect: string; wheel: string; generator: string }
type EeatItem = { id: string; title: string; body: string }

type Accent = "emerald" | "violet"

const STEP_BADGE: Record<Accent, string> = {
  emerald: "bg-emerald-600",
  violet: "bg-violet-600",
}

export function WheelGuideWhatsOnSection({
  id,
  heading,
  items,
}: {
  id: string
  heading: string
  items: readonly string[]
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

export function WheelGuideFeaturesSection({
  id,
  heading,
  intro,
  features,
}: {
  id: string
  heading: string
  intro: string
  features: readonly FeatureItem[]
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mb-6 text-base leading-relaxed text-slate-600">{intro}</p>
      <dl className="space-y-5">
        {features.map((feature) => (
          <div key={feature.title}>
            <dt className="font-spin-display font-semibold text-slate-900">{feature.title}</dt>
            <dd className="mt-1 text-base leading-relaxed text-slate-600">{feature.description}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function WheelGuideHowItWorksSection({
  id,
  heading,
  intro,
  steps,
  accent,
}: {
  id: string
  heading: string
  intro: string
  steps: readonly StepItem[]
  accent: Accent
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mb-6 text-base leading-relaxed text-slate-600">{intro}</p>
      <ol className="grid gap-4 sm:grid-cols-2">
        {steps.map((item) => (
          <li
            key={item.step}
            className={`flex gap-4 rounded-xl border p-5 shadow-sm ${
              accent === "violet" ? "border-violet-100 bg-white/90" : "border-emerald-100 bg-white/90"
            }`}
          >
            <span
              className={`font-spin-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white ${STEP_BADGE[accent]}`}
            >
              {item.step}
            </span>
            <div>
              <h3 className="font-spin-display text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function WheelGuideCustomizeSection({
  id,
  heading,
  steps,
  accent,
}: {
  id: string
  heading: string
  steps: readonly StepItem[]
  accent: Accent
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <ol className="mt-6 space-y-5">
        {steps.map((item) => (
          <li key={item.step} className="flex gap-4">
            <span
              className={`font-spin-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${STEP_BADGE[accent]}`}
            >
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
  )
}

export function WheelGuideComparisonSection({
  id,
  heading,
  intro,
  rows,
  wheelLabel,
  generatorLabel,
}: {
  id: string
  heading: string
  intro: string
  rows: readonly ComparisonRow[]
  wheelLabel: string
  generatorLabel: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mb-6 text-base leading-relaxed text-slate-600">{intro}</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[320px] text-left text-sm">
          <caption className="sr-only">{heading}</caption>
          <thead className="bg-slate-50 text-slate-900">
            <tr>
              <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                Aspect
              </th>
              <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                {wheelLabel}
              </th>
              <th scope="col" className="px-4 py-3 font-spin-display font-semibold">
                {generatorLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.aspect} className="border-t border-slate-100">
                <th
                  scope="row"
                  className="px-4 py-3 font-spin-display font-semibold text-slate-800"
                >
                  {row.aspect}
                </th>
                <td className="px-4 py-3 text-slate-600">{row.wheel}</td>
                <td className="px-4 py-3 text-slate-600">{row.generator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function WheelGuideEeatSection({
  id,
  heading,
  intro,
  sections,
}: {
  id: string
  heading: string
  intro: string
  sections: readonly EeatItem[]
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-12 scroll-mt-24">
      <h2
        id={`${id}-heading`}
        className="font-spin-display mb-3 text-2xl font-bold text-slate-900 sm:text-3xl"
      >
        {heading}
      </h2>
      <p className="mb-6 text-base leading-relaxed text-slate-600">{intro}</p>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24">
            <h3 className="font-spin-display font-semibold text-slate-900">{section.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-600">{section.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
