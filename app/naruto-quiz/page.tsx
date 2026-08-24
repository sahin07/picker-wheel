import type { Metadata } from "next"
import { NarutoQuizHub } from "@/components/naruto-wheel/naruto-quiz-hub"

export const metadata: Metadata = {
  title: { absolute: "Naruto Quiz | Character, Jutsu, Clan, Village & Quote Trivia" },
  description:
    "Choose a Naruto quiz: guess characters, jutsu, clans, villages, or quotes. Fan trivia with a score and share.",
  alternates: { canonical: "https://www.spinifywheel.com/naruto-quiz" },
}

export default function Page() {
  return <NarutoQuizHub />
}
