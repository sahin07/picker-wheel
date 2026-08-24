import { FINGER_PICKER_PATH, FINGER_PICKER_SITE_URL } from "@/lib/finger-picker-seo"
import {
  getFingerPickerUseCase,
  type FingerPickerUseCaseId,
} from "@/lib/finger-picker-use-cases"

export type FingerPickerSpokeId =
  | "pillar"
  | "who-goes-first"
  | "random-player"
  | "roulette"
  | "game"
  | "last-finger"
  | "selector"
  | "leader"
  | "who-should-pick"
  | "who-should-do-it"
  | "who-gets-chosen"
  | "who-gets-prize"
  | "finger-wheel"

export type FingerPickerDeepLink = {
  useCaseId: FingerPickerUseCaseId
}

export type FingerPickerSpokeSeo = {
  id: FingerPickerSpokeId
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
  deepLink: FingerPickerDeepLink
  tips?: readonly string[]
  updatedAt?: string
  uniqueSection?: { title: string; intro: string; points: readonly { title: string; description: string }[] }
}

type Draft = Omit<FingerPickerSpokeSeo, "keywords" | "articleTitle" | "articleIntro" | "faq" | "deepLink"> & {
  useCaseId: FingerPickerUseCaseId
  keywords?: readonly string[]
  articleTitle?: string
  articleIntro?: readonly string[]
  faq?: readonly { question: string; answer: string }[]
}

const UPDATED = "2026-08-24"

const finalize = (draft: Draft): FingerPickerSpokeSeo => {
  const useCase = getFingerPickerUseCase(draft.useCaseId)
  if (!useCase) throw new Error(`Missing Finger Picker use case: ${draft.useCaseId}`)
  return {
    id: draft.id,
    path: draft.path,
    pageTitle: draft.pageTitle,
    description: draft.description,
    h1: draft.h1,
    shortTitle: draft.shortTitle,
    heroIntro: draft.heroIntro,
    keywords: draft.keywords || [`${draft.shortTitle.toLowerCase()}`, "finger picker", "who goes first"],
    articleTitle: draft.articleTitle || `How to Use ${draft.h1}`,
    articleIntro: draft.articleIntro || [
      `${draft.h1} opens the same live Finger Picker board with a matching mode already selected. People place fingers or click markers, then a countdown chooses fairly.`,
      "This is not a name list wheel. Everyone has to be on the same screen. Use the Random Name Picker if the group is remote.",
    ],
    faq: draft.faq || [
      { question: `What is ${draft.h1}?`, answer: `${draft.h1} is a Finger Picker template with a focused mode and equal odds for every active finger.` },
      { question: "How do we start?", answer: "Place two or more fingers (or click markers on desktop), then wait for the countdown or press Pick." },
      { question: "Can we prevent repeats?", answer: "Yes. Elimination and Last Finger Standing remove the winner until one remains." },
      { question: "Does it work on phones?", answer: "Yes. Multi-touch is the intended experience. Desktop uses click-to-place markers." },
    ],
    deepLink: { useCaseId: draft.useCaseId },
    tips: draft.tips,
    updatedAt: draft.updatedAt || UPDATED,
    uniqueSection: draft.uniqueSection,
  }
}

const spoke = (
  id: FingerPickerSpokeId,
  path: string,
  h1: string,
  shortTitle: string,
  useCaseId: FingerPickerUseCaseId,
  description: string,
  extra: Partial<Draft> = {},
): FingerPickerSpokeSeo => finalize({
  id, path, h1, shortTitle, useCaseId, description,
  pageTitle: extra.pageTitle || `${h1} | Free Finger Picker`,
  heroIntro: extra.heroIntro || `${description} Place fingers on the board, countdown, and one is chosen.`,
  ...extra,
})

export const FINGER_PICKER_SPOKES: Record<FingerPickerSpokeId, FingerPickerSpokeSeo> = {
  pillar: spoke("pillar", FINGER_PICKER_PATH, "Finger Picker", "Finger Picker", "roulette", "Live random finger selector for groups sharing one screen."),
  "finger-wheel": spoke(
    "finger-wheel",
    "/finger-picker-wheel",
    "Finger Picker Wheel",
    "Finger Picker Wheel",
    "roulette",
    "A wheel-style name for the same live finger chooser—countdown, then a random finger.",
    { pageTitle: "Finger Picker Wheel | Online Finger Roulette" },
  ),
  "who-goes-first": spoke(
    "who-goes-first",
    "/who-goes-first",
    "Who Goes First?",
    "Who Goes First",
    "who-goes-first",
    "Settle first turn without arguing. Everyone puts a finger down; one player starts.",
    {
      pageTitle: "Who Goes First? | Finger Picker for Games",
      tips: ["Place fingers together so nobody can stall.", "Use Elimination if you also need a second player.", "Switch to Last Finger Standing for a full knockout."],
      uniqueSection: {
        title: "Better than drawing straws",
        intro: "Who Goes First is the highest-intent reason to use Finger Picker instead of a name wheel.",
        points: [
          { title: "Same screen", description: "The group sees the pick happen live—no hidden dice roll." },
          { title: "No roster", description: "You do not need to type names first." },
          { title: "Works in class", description: "Teachers can pick who presents or who starts a game." },
        ],
      },
    },
  ),
  "random-player": spoke(
    "random-player",
    "/random-player-picker",
    "Random Player Picker",
    "Random Player",
    "random-player",
    "Pick a random player from the fingers currently on the screen.",
    { pageTitle: "Random Player Picker | Choose One Person Live" },
  ),
  roulette: spoke(
    "roulette",
    "/finger-roulette",
    "Finger Roulette",
    "Finger Roulette",
    "roulette",
    "Classic finger roulette: hold still through the countdown, then one finger is chosen.",
    { pageTitle: "Finger Roulette | Random Finger Game" },
  ),
  game: spoke(
    "game",
    "/finger-picker-game",
    "Finger Picker Game",
    "Finger Game",
    "truth-or-dare",
    "Party finger games: truth or dare, teams, lucky finger, and don’t-get-picked.",
    { pageTitle: "Finger Picker Game | Party Finger Roulette" },
  ),
  "last-finger": spoke(
    "last-finger",
    "/last-finger-standing",
    "Last Finger Standing",
    "Last Finger Standing",
    "last-finger",
    "Eliminate the chosen finger each round until one winner remains.",
    {
      pageTitle: "Last Finger Standing | Elimination Finger Picker",
      tips: ["Keep fingers down between rounds, or tap Play Again to reset markers.", "Turn on vibration so eliminated players feel the out.", "Use Tournament mode for the same knockout with different copy."],
    },
  ),
  selector: spoke(
    "selector",
    "/random-finger-selector",
    "Random Finger Selector",
    "Finger Selector",
    "roulette",
    "Generator-style random finger selector with equal odds for every touch.",
    { pageTitle: "Random Finger Selector | Online Finger Chooser" },
  ),
  leader: spoke(
    "leader",
    "/who-should-be-the-leader",
    "Who Should Be the Leader?",
    "Who Is Leader",
    "who-goes-first",
    "Pick a group leader or captain with a live finger chooser.",
    { pageTitle: "Who Should Be the Leader? | Finger Captain Picker" },
  ),
  "who-should-pick": spoke(
    "who-should-pick",
    "/who-should-pick",
    "Who Should Pick?",
    "Who Should Pick",
    "random-player",
    "Choose who picks the next movie, song, or restaurant.",
  ),
  "who-should-do-it": spoke(
    "who-should-do-it",
    "/who-should-do-it",
    "Who Should Do It?",
    "Who Should Do It",
    "dont-get-picked",
    "The selected finger has to do the chore, dare, or next task.",
  ),
  "who-gets-chosen": spoke(
    "who-gets-chosen",
    "/who-gets-chosen",
    "Who Gets Chosen?",
    "Who Gets Chosen",
    "roulette",
    "A simple live picker when someone has to be chosen at random.",
  ),
  "who-gets-prize": spoke(
    "who-gets-prize",
    "/who-gets-the-prize",
    "Who Gets the Prize?",
    "Who Gets the Prize",
    "lucky",
    "Lucky Finger mode for a small prize, snack, or extra turn.",
    { pageTitle: "Who Gets the Prize? | Lucky Finger Picker" },
  ),
}

const EVERGREEN: FingerPickerSpokeId[] = [
  "pillar", "who-goes-first", "random-player", "roulette", "game", "last-finger", "selector",
]

export const FINGER_PICKER_POPULAR_SPOKE_LINKS = EVERGREEN.map((id) => {
  const item = FINGER_PICKER_SPOKES[id]
  return { id, label: item.shortTitle, href: item.path, description: item.description }
})

export function getFingerPickerSpoke(id: FingerPickerSpokeId) {
  return FINGER_PICKER_SPOKES[id]
}

export function getAllFingerPickerSpokes() {
  return EVERGREEN.map((id) => FINGER_PICKER_SPOKES[id])
}

export function getFingerSpokeSiblings(spokeItem: FingerPickerSpokeSeo) {
  return getAllFingerPickerSpokes().filter((item) => item.id !== spokeItem.id)
}

export function fingerSpokeUrl(path: string) {
  return `${FINGER_PICKER_SITE_URL}${path}`
}
