import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: { absolute: "Page Not Found | Picker Wheel" },
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="font-spin-display text-sm font-semibold uppercase tracking-wide text-emerald-700">
        404
      </p>
      <h1 className="mt-2 font-spin-display text-3xl font-bold text-slate-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-slate-600">
        That URL doesn’t match a Picker Wheel page. Try the home wheel or browse all tools.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-emerald-600 px-4 py-2 font-spin-display text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Home
        </Link>
        <Link
          href="/spin-wheels"
          className="rounded-lg border border-slate-300 px-4 py-2 font-spin-display text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          All Wheels
        </Link>
      </div>
    </main>
  )
}
