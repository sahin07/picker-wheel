import type { Metadata } from "next"
import { NarutoQuizApp } from "@/components/naruto-wheel/naruto-quiz-app"

export const metadata: Metadata = {
  title: { absolute: "Naruto Character Quiz | Guess the Shinobi" },
  description: "Guess characters from a unique question bank.",
  alternates: { canonical: "https://www.spinifywheel.com/naruto-character-quiz" },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <NarutoQuizApp kind="character" title="Naruto Character Quiz" intro="Guess characters from a unique question bank." />
}
