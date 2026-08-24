"use client"

import { useMemo, useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getNarutoQuizByKind, type NarutoQuizKind, type NarutoQuizQuestion } from "@/data/naruto-quiz"
import Link from "next/link"

function shuffle<T>(list: T[]): T[] {
  return [...list].sort(() => Math.random() - 0.5)
}

export function NarutoQuizApp({
  kind,
  title,
  intro,
}: {
  kind: NarutoQuizKind
  title: string
  intro: string
}) {
  const bank = useMemo(() => shuffle(getNarutoQuizByKind(kind)), [kind])
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const question: NarutoQuizQuestion | undefined = bank[index]
  const done = index >= bank.length

  const choose = (option: string) => {
    if (!question || picked) return
    setPicked(option)
    if (option === question.answer) setScore((value) => value + 1)
  }

  const next = () => {
    setPicked(null)
    setIndex((value) => value + 1)
  }

  const share = () => {
    const text = `I scored ${score}/${bank.length} on the ${title}`
    if (navigator.share) void navigator.share({ title, text, url: window.location.href }).catch(() => {})
    else void navigator.clipboard.writeText(`${text} ${window.location.href}`)
  }

  return (
    <div className="min-h-screen bg-orange-50">
      <Header onOpenSettings={() => {}} />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Naruto Quiz</p>
        <h1 className="font-spin-display mt-2 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-600">{intro}</p>
        {done || !question ? (
          <div className="mt-8 rounded-xl border bg-white p-6">
            <p className="text-2xl font-bold text-orange-900">Score: {score} / {bank.length}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => { setIndex(0); setScore(0); setPicked(null) }}>Play again</Button>
              <Button variant="outline" onClick={share}>Share score</Button>
              <Button variant="outline" asChild><Link href="/naruto-quiz">All quizzes</Link></Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">Question {index + 1} of {bank.length}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{question.prompt}</p>
            <ul className="mt-4 grid gap-2">
              {question.options.map((option) => {
                const correct = picked && option === question.answer
                const wrong = picked === option && option !== question.answer
                return (
                  <li key={option}>
                    <button type="button" onClick={() => choose(option)}
                      className={`w-full rounded-lg border px-4 py-3 text-left ${correct ? "border-emerald-400 bg-emerald-50" : wrong ? "border-red-300 bg-red-50" : "hover:border-orange-300"}`}>
                      {option}
                    </button>
                  </li>
                )
              })}
            </ul>
            {picked && (
              <Button className="mt-4 bg-orange-600 hover:bg-orange-700" onClick={next}>Next</Button>
            )}
          </div>
        )}
        <p className="mt-8 text-sm text-slate-500">
          Independent fan quiz. Not affiliated with Masashi Kishimoto, Shueisha, Studio Pierrot, or Viz Media.
        </p>
      </main>
      <Footer />
    </div>
  )
}
