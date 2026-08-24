"use client"

import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

const LINKS = [
  { href: "/naruto-character-quiz", label: "Naruto Character Quiz" },
  { href: "/naruto-jutsu-quiz", label: "Naruto Jutsu Quiz" },
  { href: "/naruto-clan-quiz", label: "Naruto Clan Quiz" },
  { href: "/naruto-village-quiz", label: "Naruto Village Quiz" },
  { href: "/naruto-quote-quiz", label: "Naruto Quote Quiz" },
]

export function NarutoQuizHub() {
  return (
    <div className="min-h-screen bg-orange-50">
      <Header onOpenSettings={() => {}} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-spin-display text-3xl font-bold text-slate-900">Naruto Quiz</h1>
        <p className="mt-3 text-slate-600">
          Five unique question banks — not copies of the character wheel.
        </p>
        <ul className="mt-8 grid gap-3">
          {LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border bg-white p-4 hover:border-orange-300"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/naruto-spin-wheel-picker" className="text-orange-700 underline">
            Back to Naruto Wheel
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  )
}
