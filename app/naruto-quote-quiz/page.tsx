import type { Metadata } from "next"
import { NarutoQuizApp } from "@/components/naruto-wheel/naruto-quiz-app"

export const metadata: Metadata = {
  title: { absolute: "Naruto Quote Quiz | Guess the Speaker" },
  description: "Guess which Naruto character said the famous line. Fan trivia with a score and share.",
  alternates: { canonical: "https://www.spinifywheel.com/naruto-quote-quiz" },
  robots: { index: true, follow: true },
}

export default function Page() {
  return (
    <NarutoQuizApp
      kind="quote"
      title="Naruto Quote Quiz"
      intro="Match famous lines and catchphrases to the right shinobi."
    />
  )
}
