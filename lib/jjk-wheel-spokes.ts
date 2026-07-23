import { JJK_WHEEL_PATH, JJK_WHEEL_SITE_URL } from "@/lib/jjk-wheel-seo"
import { getJjkWheelUseCase, type JjkWheelUseCaseId } from "@/lib/jjk-wheel-use-cases"

export type JjkWheelSpokeId =
  | "jjk" | "jujutsu-kaisen" | "character" | "villain" | "cursed-spirit"
  | "domain" | "technique" | "grade-1" | "special-grade" | "student"
  | "teacher" | "favorite" | "team"

export type JjkWheelDeepLink = {
  useCaseId: JjkWheelUseCaseId
  config: NonNullable<ReturnType<typeof getJjkWheelUseCase>>["config"]
}

export type JjkWheelSpokeSeo = {
  id: JjkWheelSpokeId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  articleTitle: string
  articleIntro: readonly string[]
  faq: readonly { question: string; answer: string }[]
  deepLink: JjkWheelDeepLink
}

type Draft = Omit<JjkWheelSpokeSeo, "keywords" | "articleTitle" | "articleIntro" | "faq" | "deepLink"> & {
  useCaseId: JjkWheelUseCaseId
  keywords?: readonly string[]
  articleTitle?: string
  articleIntro?: readonly string[]
}

const finalize = (draft: Draft): JjkWheelSpokeSeo => {
  const useCase = getJjkWheelUseCase(draft.useCaseId)
  if (!useCase) throw new Error(`Missing JJK use case: ${draft.useCaseId}`)
  return {
    id: draft.id,
    path: draft.path,
    pageTitle: draft.pageTitle,
    description: draft.description,
    h1: draft.h1,
    shortTitle: draft.shortTitle,
    heroIntro: draft.heroIntro,
    keywords: draft.keywords || [`${draft.shortTitle.toLowerCase()} wheel`, "jjk wheel", "Jujutsu Kaisen spinner"],
    articleTitle: draft.articleTitle || `How to Use the ${draft.h1}`,
    articleIntro: draft.articleIntro || [
      `${draft.h1} opens the same equal-odds JJK spinner with a focused preset already selected. Every enabled entry has one matching slice and the same chance to win.`,
      "You can change the list, add custom names and images, or use Elimination mode for no-repeat rounds. Results are for fan entertainment and creative challenges.",
    ],
    faq: [
      { question: `What is the ${draft.h1}?`, answer: `${draft.h1} is a ready-made JJK Spin Wheel picker template with a matching catalog filter and equal odds.` },
      { question: "Can I change the entries?", answer: "Yes. Toggle catalog entries, add custom names and images, or switch to another template at any time." },
      { question: "Can I prevent repeat winners?", answer: "Yes. Elimination mode disables each winner after the spin." },
      { question: "Is this official?", answer: "No. This independent fan tool is not affiliated with Gege Akutami, Shueisha, MAPPA, or Toho." },
    ],
    deepLink: { useCaseId: draft.useCaseId, config: useCase.config },
  }
}

const spoke = (
  id: JjkWheelSpokeId, path: string, h1: string, shortTitle: string,
  useCaseId: JjkWheelUseCaseId, description: string,
): JjkWheelSpokeSeo => finalize({
  id, path, h1, shortTitle, useCaseId, description,
  pageTitle: `${h1} | Free Random Jujutsu Kaisen Spinner`,
  heroIntro: `${description} Spin with equal odds, customize the entries, or use elimination for no-repeat rounds.`,
})

export const JJK_WHEEL_SPOKES: Record<JjkWheelSpokeId, JjkWheelSpokeSeo> = {
  jjk: spoke("jjk", JJK_WHEEL_PATH, "JJK Spin Wheel picker", "JJK Wheel", "all", "Spin the full curated JJK character catalog."),
  "jujutsu-kaisen": finalize({
    id: "jujutsu-kaisen",
    path: "/jujutsu-kaisen-wheel",
    useCaseId: "all",
    pageTitle: "Jujutsu Kaisen Wheel | Random JJK Character Spinner",
    description: "Use a free Jujutsu Kaisen Wheel to pick a random character with equal odds, custom entries, and elimination mode.",
    h1: "Jujutsu Kaisen Wheel",
    shortTitle: "Jujutsu Kaisen",
    heroIntro: "Spin a random Jujutsu Kaisen character for fan challenges, team drafts, cosplay prompts, edits, and discussions.",
    keywords: ["jujutsu kaisen wheel", "jujutsu kaisen spinner", "random Jujutsu Kaisen character", "JJK character picker"],
    articleTitle: "Use the Jujutsu Kaisen Character Wheel",
    articleIntro: [
      "This brand-name twin of the JJK Spin Wheel picker hub opens the same complete character picker while providing a dedicated guide for Jujutsu Kaisen Wheel searches.",
      "Every enabled character has equal odds. You can narrow the list, upload custom images, and use Elimination mode for team drafts without repeats.",
    ],
  }),
  character: spoke("character", "/jjk-character-wheel", "JJK Character Wheel", "Characters", "all", "Pick a random JJK character from the full catalog."),
  villain: spoke("villain", "/jjk-villain-wheel", "JJK Villain Wheel", "Villains", "villains", "Randomize JJK villains and antagonists."),
  "cursed-spirit": spoke("cursed-spirit", "/jjk-cursed-spirit-wheel", "JJK Cursed Spirit Wheel", "Cursed Spirits", "cursed-spirits", "Spin among cursed spirits from the JJK catalog."),
  domain: spoke("domain", "/jjk-domain-expansion-wheel", "JJK Domain Expansion Wheel", "Domain Expansions", "domain", "Pick a named Domain Expansion at random."),
  technique: spoke("technique", "/jjk-cursed-technique-wheel", "JJK Cursed Technique Wheel", "Cursed Techniques", "technique", "Choose a cursed technique for a challenge or prompt."),
  "grade-1": spoke("grade-1", "/jjk-grade-1-sorcerer-wheel", "JJK Grade 1 Sorcerer Wheel", "Grade 1", "grade-1", "Spin a focused list of Grade 1 sorcerers."),
  "special-grade": spoke("special-grade", "/jjk-special-grade-wheel", "JJK Special Grade Wheel", "Special Grade", "special-grade", "Randomize special-grade sorcerers and curses."),
  student: spoke("student", "/jjk-student-wheel", "JJK Student Wheel", "Students", "students", "Pick a Tokyo or Kyoto Jujutsu High student."),
  teacher: spoke("teacher", "/jjk-teacher-wheel", "JJK Teacher Wheel", "Teachers", "teachers", "Pick a teacher or school staff character."),
  favorite: spoke("favorite", "/favorite-jjk-character-picker", "Favorite JJK Character Picker", "Fan Favorites", "favorites", "Spin a compact list of recognizable fan favorites."),
  team: spoke("team", "/jjk-team-generator", "JJK Team Generator", "Team Draft", "team", "Draft JJK students and sorcerers with elimination-friendly spins."),
}

const EVERGREEN: JjkWheelSpokeId[] = [
  "jjk", "jujutsu-kaisen", "character", "villain", "cursed-spirit", "domain",
  "technique", "student", "teacher", "grade-1", "special-grade", "favorite", "team",
]

export const JJK_WHEEL_POPULAR_SPOKE_LINKS = EVERGREEN.map((id) => {
  const item = JJK_WHEEL_SPOKES[id]
  const useCase = getJjkWheelUseCase(item.deepLink.useCaseId)!
  return { id, label: item.shortTitle, href: item.path, description: item.description, accent: useCase.accent }
})

export function getJjkWheelSpoke(id: JjkWheelSpokeId) {
  return JJK_WHEEL_SPOKES[id]
}

export function getAllJjkWheelSpokes() {
  return EVERGREEN.map((id) => JJK_WHEEL_SPOKES[id])
}

export function getJjkSpokeSiblings(spoke: JjkWheelSpokeSeo) {
  return getAllJjkWheelSpokes().filter((item) => item.id !== spoke.id)
}

export function jjkSpokeUrl(path: string) {
  return `${JJK_WHEEL_SITE_URL}${path}`
}
