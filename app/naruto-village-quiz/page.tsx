import type { Metadata } from "next"
import { NarutoQuizApp } from "@/components/naruto-wheel/naruto-quiz-app"

export const metadata: Metadata = {
  title: { absolute: "Naruto Village Quiz | Hidden Villages" },
  description: "Name Hidden Leaf, Sand, Mist, Cloud, Stone, and more.",
  alternates: { canonical: "https://www.spinifywheel.com/naruto-village-quiz" },
  robots: { index: true, follow: true },
}

export default function Page() {
  return <NarutoQuizApp kind="village" title="Naruto Village Quiz" intro="Name Hidden Leaf, Sand, Mist, Cloud, Stone, and more." />
}
