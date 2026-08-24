import { NARUTO_WHEEL_PATH, NARUTO_WHEEL_SITE_URL } from "@/lib/naruto-wheel-seo"
import { getNarutoWheelUseCase, type NarutoWheelUseCaseId } from "@/lib/naruto-wheel-use-cases"

export type NarutoWheelSpokeId =
  | "pillar"
  | "character"
  | "random"
  | "shippuden"
  | "boruto"
  | "akatsuki"
  | "hokage"
  | "uchiha"
  | "jinchuriki"
  | "kage"
  | "sensei"
  | "shinobi"
  | "team"
  | "jutsu"
  | "village"
  | "clan"
  | "fight"
  | "who-am-i"
  | "draw"
  | "cosplay"
  | "clan-am-i"
  | "village-join"
  | "jutsu-use"
  | "fight-who"
  | "team-join"

export type NarutoWheelDeepLink = {
  useCaseId: NarutoWheelUseCaseId
  config: NonNullable<ReturnType<typeof getNarutoWheelUseCase>>["config"]
}

export type NarutoWheelSpokeSeo = {
  id: NarutoWheelSpokeId
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
  deepLink: NarutoWheelDeepLink
  tips?: readonly string[]
  updatedAt?: string
  relatedLinks?: readonly { href: string; label: string }[]
}

type Draft = Omit<NarutoWheelSpokeSeo, "keywords" | "articleTitle" | "articleIntro" | "faq" | "deepLink"> & {
  useCaseId: NarutoWheelUseCaseId
  keywords?: readonly string[]
  articleTitle?: string
  articleIntro?: readonly string[]
  faq?: readonly { question: string; answer: string }[]
}

const UPDATED = "2026-08-24"

const finalize = (draft: Draft): NarutoWheelSpokeSeo => {
  const useCase = getNarutoWheelUseCase(draft.useCaseId)
  if (!useCase) throw new Error(`Missing Naruto use case: ${draft.useCaseId}`)
  return {
    id: draft.id,
    path: draft.path,
    pageTitle: draft.pageTitle,
    description: draft.description,
    h1: draft.h1,
    shortTitle: draft.shortTitle,
    heroIntro: draft.heroIntro,
    keywords: draft.keywords || [`${draft.shortTitle.toLowerCase()} wheel`, "naruto wheel", "naruto spinner"],
    articleTitle: draft.articleTitle || `How to Use the ${draft.h1}`,
    articleIntro: draft.articleIntro || [
      `${draft.h1} opens the same equal-odds Naruto spinner with a focused preset already selected. Every enabled entry has one matching slice and the same chance to win.`,
      "You can change the list, add custom names and images, or use Elimination mode for no-repeat rounds. Results are for fan entertainment and creative challenges.",
    ],
    faq: draft.faq || [
      { question: `What is the ${draft.h1}?`, answer: `${draft.h1} is a ready-made Naruto Wheel template with a matching catalog filter and equal odds.` },
      { question: "Can I change the entries?", answer: "Yes. Toggle catalog entries, add custom names and images, or switch to another template at any time." },
      { question: "Can I prevent repeat winners?", answer: "Yes. Elimination mode disables each winner after the spin." },
      { question: "Is this official?", answer: "No. This independent fan tool is not affiliated with Masashi Kishimoto, Shueisha, Studio Pierrot, or Viz Media." },
    ],
    deepLink: { useCaseId: draft.useCaseId, config: useCase.config },
    tips: draft.tips,
    updatedAt: draft.updatedAt || UPDATED,
    relatedLinks: draft.relatedLinks,
  }
}

const spoke = (
  id: NarutoWheelSpokeId,
  path: string,
  h1: string,
  shortTitle: string,
  useCaseId: NarutoWheelUseCaseId,
  description: string,
  extra: Partial<Draft> = {},
): NarutoWheelSpokeSeo => finalize({
  id, path, h1, shortTitle, useCaseId, description,
  pageTitle: extra.pageTitle || `${h1} | Free Random Naruto Spinner`,
  heroIntro: extra.heroIntro || `${description} Spin with equal odds, customize the entries, or use elimination for no-repeat rounds.`,
  ...extra,
})

export const NARUTO_WHEEL_SPOKES: Record<NarutoWheelSpokeId, NarutoWheelSpokeSeo> = {
  pillar: spoke("pillar", NARUTO_WHEEL_PATH, "Naruto Wheel", "Naruto Wheel", "all", "Spin the full curated Naruto character catalog."),
  character: spoke(
    "character",
    "/naruto-character-wheel",
    "Naruto Character Wheel",
    "Characters",
    "all",
    "Pick a random Naruto character from the full catalog.",
    {
      pageTitle: "Naruto Character Wheel | Random Shinobi Spinner",
      tips: ["Load All Characters, then hide names you do not recognize.", "Use Elimination for a no-repeat watch-party challenge."],
    },
  ),
  random: spoke(
    "random",
    "/random-naruto-character",
    "Random Naruto Character",
    "Random Character",
    "all",
    "Generate a random Naruto character in one spin instead of scrolling a wiki list.",
    {
      pageTitle: "Random Naruto Character Generator | Equal-Odds Spinner",
      articleTitle: "Use a Random Naruto Character Generator",
      articleIntro: [
        "This page is for searches that want a generator-style result: one random Naruto character, shown live on a wheel instead of a hidden dice roll.",
        "The same Naruto Wheel catalog loads automatically. Toggle entries if you only want Part I, Shippuden, or Boruto names, then spin.",
      ],
    },
  ),
  shippuden: spoke("shippuden", "/naruto-shippuden-character-wheel", "Naruto Shippuden Character Wheel", "Shippuden", "shippuden", "Spin Shippuden-era characters for later-arc challenges."),
  boruto: spoke("boruto", "/boruto-character-wheel", "Boruto Character Wheel", "Boruto", "boruto", "Pick next-generation Konoha and Kara characters."),
  akatsuki: spoke("akatsuki", "/akatsuki-wheel", "Akatsuki Wheel", "Akatsuki", "akatsuki", "Randomly select an Akatsuki member."),
  hokage: spoke("hokage", "/hokage-wheel", "Hokage Wheel", "Hokage", "hokage", "Spin past and present Hokage of Konoha."),
  uchiha: spoke("uchiha", "/uchiha-wheel", "Uchiha Wheel", "Uchiha", "uchiha", "Pick a random Uchiha clan shinobi."),
  jinchuriki: spoke("jinchuriki", "/jinchuriki-wheel", "Jinchuriki Wheel", "Jinchuriki", "jinchuriki", "Spin tailed-beast hosts and bijū names."),
  kage: spoke("kage", "/kage-wheel", "Kage Wheel", "Kage", "kage", "Randomize the five Kage and other village leaders."),
  sensei: spoke("sensei", "/naruto-sensei-wheel", "Naruto Sensei Wheel", "Sensei", "sensei", "Spin teachers and jōnin instructors for team-draft prompts."),
  shinobi: spoke("shinobi", "/naruto-shinobi-wheel", "Naruto Shinobi Wheel", "Shinobi", "shinobi", "Pick from active ninja across the curated catalog."),
  team: spoke(
    "team",
    "/naruto-team-generator",
    "Naruto Team Generator",
    "Team Generator",
    "team",
    "Draft a four-person squad plus a sensei with elimination-friendly spins.",
    { pageTitle: "Naruto Team Generator | Random 4-Person Squad Spinner" },
  ),
  jutsu: spoke("jutsu", "/naruto-jutsu-wheel", "Naruto Jutsu Wheel", "Jutsu", "jutsu", "Spin a named jutsu or ability for challenges and writing prompts."),
  village: spoke("village", "/naruto-village-wheel", "Naruto Village Wheel", "Villages", "village", "Pick Hidden Leaf, Sand, Mist, Cloud, Stone, and more."),
  clan: spoke("clan", "/naruto-clan-wheel", "Naruto Clan Wheel", "Clans", "clan", "Spin Uchiha, Hyūga, Uzumaki, and other clans."),
  fight: spoke(
    "fight",
    "/naruto-fight-wheel",
    "Naruto Fight Wheel",
    "Fight",
    "fight",
    "Spin two characters into a versus matchup, then vote locally for a winner.",
    { pageTitle: "Naruto Fight Wheel | Random Character Versus Spinner" },
  ),
  "who-am-i": spoke(
    "who-am-i",
    "/what-naruto-character-am-i",
    "What Naruto Character Am I?",
    "Who Am I",
    "who-are-you",
    "Spin character, village, clan, nature, kekkei genkai, rank, and summon to build a fan identity.",
    {
      pageTitle: "What Naruto Character Am I? | Who Are You Spinner",
      tips: ["Spin each trait in order, then share the full identity card.", "Swap one trait if your group wants a house-rule reroll."],
    },
  ),
  draw: spoke(
    "draw",
    "/which-naruto-character-should-i-draw",
    "Which Naruto Character Should I Draw?",
    "Draw Prompt",
    "all",
    "Land on a character for a drawing or sketch challenge.",
    { pageTitle: "Which Naruto Character Should I Draw? | Art Prompt Wheel" },
  ),
  cosplay: spoke(
    "cosplay",
    "/what-naruto-character-should-i-cosplay",
    "What Naruto Character Should I Cosplay?",
    "Cosplay",
    "favorites",
    "Spin a recognizable character for costume inspiration.",
    { pageTitle: "What Naruto Character Should I Cosplay? | Costume Spinner" },
  ),
  "clan-am-i": spoke(
    "clan-am-i",
    "/which-naruto-clan-am-i",
    "Which Naruto Clan Am I?",
    "Which Clan",
    "clan",
    "Assign a clan identity for roleplay, quizzes, and OC prompts.",
  ),
  "village-join": spoke(
    "village-join",
    "/which-naruto-village-should-i-join",
    "Which Naruto Village Should I Join?",
    "Join a Village",
    "village",
    "Spin Hidden Leaf, Sand, Mist, Cloud, Stone, and other villages.",
  ),
  "jutsu-use": spoke(
    "jutsu-use",
    "/which-naruto-jutsu-should-i-use",
    "Which Naruto Jutsu Should I Use?",
    "Which Jutsu",
    "jutsu",
    "Pick a technique for writing, games, or challenge rounds.",
  ),
  "fight-who": spoke(
    "fight-who",
    "/which-naruto-character-should-i-fight",
    "Which Naruto Character Should I Fight?",
    "Who to Fight",
    "fight",
    "Spin an opponent for a fan versus debate.",
  ),
  "team-join": spoke(
    "team-join",
    "/which-naruto-team-should-i-join",
    "Which Naruto Team Should I Join?",
    "Join a Team",
    "team",
    "Draft squadmates with the team generator preset.",
  ),
}

const EVERGREEN: NarutoWheelSpokeId[] = [
  "pillar", "character", "random", "shippuden", "boruto", "akatsuki", "hokage",
  "uchiha", "jinchuriki", "kage", "sensei", "shinobi", "team", "jutsu", "village", "clan", "fight",
  "who-am-i", "draw", "cosplay",
]

export const NARUTO_WHEEL_POPULAR_SPOKE_LINKS = EVERGREEN.map((id) => {
  const item = NARUTO_WHEEL_SPOKES[id]
  const useCase = getNarutoWheelUseCase(item.deepLink.useCaseId)!
  return { id, label: item.shortTitle, href: item.path, description: item.description, accent: useCase.accent }
})

export function getNarutoWheelSpoke(id: NarutoWheelSpokeId) {
  return NARUTO_WHEEL_SPOKES[id]
}

export function getAllNarutoWheelSpokes() {
  return EVERGREEN.map((id) => NARUTO_WHEEL_SPOKES[id])
}

export function getNarutoSpokeSiblings(spoke: NarutoWheelSpokeSeo) {
  return getAllNarutoWheelSpokes().filter((item) => item.id !== spoke.id)
}

export function narutoSpokeUrl(path: string) {
  return `${NARUTO_WHEEL_SITE_URL}${path}`
}
