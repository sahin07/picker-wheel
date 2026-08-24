import type { Metadata } from "next"
import { NarutoQuizApp } from "@/components/naruto-wheel/naruto-quiz-app"

export const metadata: Metadata = {
  title: { absolute: "Naruto Jutsu Quiz | Guess the Technique" },
  description: "Identify named jutsu from multiple-choice clues.",
  alternates: { canonical: "https://www.spinifywheel.com/naruto-jutsu-quiz" },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <NarutoQuizApp kind="jutsu" title="Naruto Jutsu Quiz" intro="Identify named jutsu from multiple-choice clues." />
}
