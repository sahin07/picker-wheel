import { DEMON_SLAYER_WHEEL_PATH, DEMON_SLAYER_WHEEL_SITE_URL } from "@/lib/demon-slayer-wheel-seo"
import { getDemonSlayerWheelUseCase, type DemonSlayerWheelUseCaseId } from "@/lib/demon-slayer-wheel-use-cases"

export type DemonSlayerWheelSpokeId =
  | "pillar"
  | "demon-slayer"
  | "character"
  | "random"
  | "hashira"
  | "hashira-picker"
  | "upper-rank"
  | "lower-rank"
  | "breathing"
  | "nichirin"
  | "corps"
  | "favorite"

export type DemonSlayerWheelDeepLink = {
  useCaseId: DemonSlayerWheelUseCaseId
  config: NonNullable<ReturnType<typeof getDemonSlayerWheelUseCase>>["config"]
}

export type DemonSlayerWheelSpokeSeo = {
  id: DemonSlayerWheelSpokeId
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
  deepLink: DemonSlayerWheelDeepLink
}

type Draft = Omit<DemonSlayerWheelSpokeSeo, "keywords" | "articleTitle" | "articleIntro" | "faq" | "deepLink"> & {
  useCaseId: DemonSlayerWheelUseCaseId
  keywords?: readonly string[]
  articleTitle?: string
  articleIntro?: readonly string[]
}

const finalize = (draft: Draft): DemonSlayerWheelSpokeSeo => {
  const useCase = getDemonSlayerWheelUseCase(draft.useCaseId)
  if (!useCase) throw new Error(`Missing Demon Slayer use case: ${draft.useCaseId}`)
  return {
    id: draft.id,
    path: draft.path,
    pageTitle: draft.pageTitle,
    description: draft.description,
    h1: draft.h1,
    shortTitle: draft.shortTitle,
    heroIntro: draft.heroIntro,
    keywords: draft.keywords || [
      `${draft.shortTitle.toLowerCase()} wheel`,
      "demon slayer wheel",
      "Demon Slayer spinner",
    ],
    articleTitle: draft.articleTitle || `How to Use the ${draft.h1}`,
    articleIntro: draft.articleIntro || [
      `${draft.h1} opens the same equal-odds Demon Slayer spinner with a focused preset already selected. Every enabled entry has one matching slice and the same chance to win.`,
      "You can change the list, add custom names and images, or use Elimination mode for no-repeat rounds. Results are for fan entertainment and creative challenges.",
    ],
    faq: [
      {
        question: `What is the ${draft.h1}?`,
        answer: `${draft.h1} is a ready-made Demon Slayer Spin Wheel template with a matching catalog filter and equal odds.`,
      },
      {
        question: "Can I change the entries?",
        answer: "Yes. Toggle catalog entries, add custom names and images, or switch to another template at any time.",
      },
      {
        question: "Can I prevent repeat winners?",
        answer: "Yes. Elimination mode disables each winner after the spin.",
      },
      {
        question: "Is this official?",
        answer:
          "No. This independent fan tool is not affiliated with Koyoharu Gotouge, Shueisha, Aniplex, ufotable, or related rights holders.",
      },
    ],
    deepLink: { useCaseId: draft.useCaseId, config: useCase.config },
  }
}

const spoke = (
  id: DemonSlayerWheelSpokeId,
  path: string,
  h1: string,
  shortTitle: string,
  useCaseId: DemonSlayerWheelUseCaseId,
  description: string,
): DemonSlayerWheelSpokeSeo =>
  finalize({
    id,
    path,
    h1,
    shortTitle,
    useCaseId,
    description,
    pageTitle: `${h1} | Free Random Demon Slayer Spinner`,
    heroIntro: `${description} Spin with equal odds, customize the entries, or use elimination for no-repeat rounds.`,
  })

export const DEMON_SLAYER_WHEEL_SPOKES: Record<DemonSlayerWheelSpokeId, DemonSlayerWheelSpokeSeo> = {
  pillar: spoke(
    "pillar",
    DEMON_SLAYER_WHEEL_PATH,
    "Demon Slayer Spin Wheel",
    "Demon Slayer Wheel",
    "all",
    "Spin the full curated Demon Slayer character catalog.",
  ),
  "demon-slayer": finalize({
    id: "demon-slayer",
    path: "/demon-slayer-wheel",
    useCaseId: "all",
    pageTitle: "Demon Slayer Wheel | Random Character Spinner",
    description:
      "Use a free Demon Slayer Wheel to pick a random character with equal odds, custom entries, and elimination mode.",
    h1: "Demon Slayer Wheel",
    shortTitle: "Demon Slayer",
    heroIntro:
      "Spin a random Demon Slayer character for fan challenges, team drafts, cosplay prompts, edits, and discussions.",
    keywords: [
      "demon slayer wheel",
      "kimetsu no yaiba wheel",
      "random Demon Slayer character",
      "demon slayer spinner",
    ],
    articleTitle: "Use the Demon Slayer Character Wheel",
    articleIntro: [
      "This brand-name twin of the Demon Slayer Spin Wheel hub opens the same complete character picker while providing a dedicated guide for Demon Slayer Wheel and Kimetsu no Yaiba Wheel searches.",
      "Every enabled character has equal odds. You can narrow the list, upload custom images, and use Elimination mode for team drafts without repeats.",
    ],
  }),
  character: spoke(
    "character",
    "/demon-slayer-character-wheel",
    "Demon Slayer Character Wheel",
    "Characters",
    "all",
    "Pick a random Demon Slayer character from the full catalog.",
  ),
  random: spoke(
    "random",
    "/random-demon-slayer-character",
    "Random Demon Slayer Character",
    "Random Character",
    "all",
    "Get a random Demon Slayer character with a fair spin.",
  ),
  hashira: spoke(
    "hashira",
    "/hashira-wheel",
    "Hashira Wheel",
    "Hashira",
    "hashira",
    "Randomize among the Hashira for anime challenges.",
  ),
  "hashira-picker": finalize({
    id: "hashira-picker",
    path: "/hashira-picker",
    useCaseId: "hashira",
    pageTitle: "Hashira Picker | Random Demon Slayer Hashira Spinner",
    description:
      "Use the Hashira Picker to spin a random Demon Slayer Hashira with equal odds for challenges, drafts, and fan games.",
    h1: "Hashira Picker",
    shortTitle: "Hashira Picker",
    heroIntro: "Pick a random Hashira for cosplay inspiration, discussion prompts, or no-repeat challenge rounds.",
    keywords: ["hashira picker", "random hashira", "hashira wheel", "demon slayer hashira"],
  }),
  "upper-rank": spoke(
    "upper-rank",
    "/upper-rank-demon-wheel",
    "Upper Rank Demon Wheel",
    "Upper Rank",
    "upper-rank",
    "Spin Upper Moon demons for discussions and trivia.",
  ),
  "lower-rank": spoke(
    "lower-rank",
    "/lower-rank-demon-wheel",
    "Lower Rank Demon Wheel",
    "Lower Rank",
    "lower-rank",
    "Spin Lower Moon demons for focused fan challenges.",
  ),
  breathing: spoke(
    "breathing",
    "/demon-slayer-breathing-style-wheel",
    "Demon Slayer Breathing Style Wheel",
    "Breathing Styles",
    "breathing",
    "Choose a breathing style for cosplay or role-play.",
  ),
  nichirin: spoke(
    "nichirin",
    "/nichirin-color-wheel",
    "Nichirin Color Wheel",
    "Nichirin Colors",
    "nichirin",
    "Pick a Nichirin sword color at random.",
  ),
  corps: spoke(
    "corps",
    "/demon-slayer-corps-wheel",
    "Demon Slayer Corps Wheel",
    "Corps Members",
    "corps",
    "Spin Demon Slayer Corps members for team challenges.",
  ),
  favorite: spoke(
    "favorite",
    "/favorite-demon-slayer-character",
    "Favorite Demon Slayer Character",
    "Fan Favorites",
    "favorites",
    "Spin a compact list of recognizable fan favorites.",
  ),
}

const EVERGREEN: DemonSlayerWheelSpokeId[] = [
  "pillar",
  "demon-slayer",
  "character",
  "hashira",
  "upper-rank",
  "lower-rank",
  "breathing",
  "nichirin",
  "corps",
  "favorite",
  "random",
  "hashira-picker",
]

export const DEMON_SLAYER_WHEEL_POPULAR_SPOKE_LINKS = EVERGREEN.map((id) => {
  const item = DEMON_SLAYER_WHEEL_SPOKES[id]
  const useCase = getDemonSlayerWheelUseCase(item.deepLink.useCaseId)!
  return {
    id,
    label: item.shortTitle,
    href: item.path,
    description: item.description,
    accent: useCase.accent,
  }
})

export function getDemonSlayerWheelSpoke(id: DemonSlayerWheelSpokeId) {
  return DEMON_SLAYER_WHEEL_SPOKES[id]
}

export function getAllDemonSlayerWheelSpokes() {
  return EVERGREEN.map((id) => DEMON_SLAYER_WHEEL_SPOKES[id])
}

export function getDemonSlayerSpokeSiblings(spoke: DemonSlayerWheelSpokeSeo) {
  return getAllDemonSlayerWheelSpokes().filter((item) => item.id !== spoke.id)
}

export function demonSlayerSpokeUrl(path: string) {
  return `${DEMON_SLAYER_WHEEL_SITE_URL}${path}`
}
