import type { Metadata } from "next"
import { NarutoQuizApp } from "@/components/naruto-wheel/naruto-quiz-app"

export const metadata: Metadata = {
  title: { absolute: "Naruto Clan Quiz | Guess the Clan" },
  description: "Match kekkei genkai and specialties to clans.",
  alternates: { canonical: "https://www.spinifywheel.com/naruto-clan-quiz" },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <NarutoQuizApp kind="clan" title="Naruto Clan Quiz" intro="Match kekkei genkai and specialties to clans." />
}
