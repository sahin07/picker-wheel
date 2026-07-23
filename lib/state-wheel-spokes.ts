import {
  STATE_WHEEL_PAGE_TITLE,
  STATE_WHEEL_PATH,
  STATE_WHEEL_SITE_URL,
} from "@/lib/state-wheel-seo"
import {
  STATE_WHEEL_USE_CASES,
  getStateWheelUseCase,
  type StateWheelUseCaseAccent,
  type StateWheelUseCaseConfig,
  type StateWheelUseCaseId,
} from "@/lib/state-wheel-use-cases"

export type StateWheelSpokeId = StateWheelUseCaseId

export type StateWheelDeepLink = {
  useCaseId: StateWheelUseCaseId
  config: StateWheelUseCaseConfig
}

export type StateWheelSpokeFaq = {
  question: string
  answer: string
}

export type StateWheelSpokeSeo = {
  id: StateWheelSpokeId
  path: string
  pageTitle: string
  description: string
  h1: string
  shortTitle: string
  heroIntro: string
  keywords: readonly string[]
  articleTitle: string
  articleIntro: readonly string[]
  uniqueSection: {
    title: string
    intro: string
    points: readonly { title: string; description: string }[]
  }
  faq: readonly StateWheelSpokeFaq[]
  siblingIds: readonly StateWheelSpokeId[]
  deepLink: StateWheelDeepLink
  accent: StateWheelUseCaseAccent
}

export function stateSpokeUrl(path: string): string {
  return `${STATE_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

function configFor(id: StateWheelUseCaseId): StateWheelUseCaseConfig {
  const useCase = getStateWheelUseCase(id)
  if (!useCase) {
    return getStateWheelUseCase("all")!.config
  }
  return useCase.config
}

type SpokeDraft = Omit<StateWheelSpokeSeo, "siblingIds" | "deepLink" | "faq" | "accent"> & {
  faq?: readonly StateWheelSpokeFaq[]
  accent?: StateWheelUseCaseAccent
  faqLabel?: string
}

const ALL_IDS = STATE_WHEEL_USE_CASES.map((u) => u.id) as StateWheelSpokeId[]

function siblingsExcept(id: StateWheelSpokeId): StateWheelSpokeId[] {
  return ALL_IDS.filter((x) => x !== id).slice(0, 8)
}

function baseFaq(label: string): StateWheelSpokeFaq[] {
  return [
    {
      question: `What is the ${label}?`,
      answer: `It is a State Picker Wheel template preloaded for ${label.toLowerCase()} so every spin stays inside that country pool with equal odds.`,
    },
    {
      question: "Can I switch to a different country?",
      answer: `Yes. Open the hub at ${STATE_WHEEL_PATH} or choose a different country template.`,
    },
    {
      question: "Are spins fair?",
      answer: "Yes. Each enabled state or province on the wheel has equal probability.",
    },
    {
      question: "What shows after I spin?",
      answer:
        "The result card shows the state name plus its capital and country when available.",
    },
    {
      question: "Can I open Themes and Games on this page?",
      answer:
        "Yes. Themes, Games, Achievements, Analytics, and Social chips work the same as on the main State Picker Wheel.",
    },
  ]
}

function finalize(draft: SpokeDraft): StateWheelSpokeSeo {
  const useCase = getStateWheelUseCase(draft.id)
  const { faqLabel, faq, accent, ...rest } = draft
  return {
    ...rest,
    accent: accent ?? useCase?.accent ?? "sky",
    faq: faq ?? baseFaq(faqLabel || draft.h1),
    siblingIds: siblingsExcept(draft.id),
    deepLink: { useCaseId: draft.id, config: configFor(draft.id) },
  }
}

function countrySpoke(
  id: StateWheelSpokeId,
  path: string,
  countryLabel: string,
  regionLabel: string,
  accent: StateWheelUseCaseAccent,
): StateWheelSpokeSeo {
  return finalize({
    id,
    path,
    accent,
    pageTitle: `${countryLabel} Picker Wheel | Random ${regionLabel} Spinner`,
    description: `Spin a random ${countryLabel.toLowerCase()} for geography quizzes, classroom picks, and fair decisions.`,
    h1: `${countryLabel} Picker Wheel`,
    shortTitle: `${countryLabel} Picker Wheel`,
    heroIntro: `Load ${countryLabel.toLowerCase()}s and spin a fair pick for geography quizzes, classroom activities, and trivia games.`,
    keywords: [
      `${countryLabel.toLowerCase()} picker wheel`,
      `random ${regionLabel.toLowerCase()}`,
      "state picker wheel",
      "geography wheel",
    ],
    articleTitle: `Using a ${countryLabel} Picker Wheel`,
    articleIntro: [
      `This template keeps the pool to ${countryLabel.toLowerCase()}s so every spin stays within that country.`,
      "Use Elimination Mode for multi-round quizzes and open Results to recap winners.",
    ],
    uniqueSection: {
      title: `Built for ${countryLabel} challenges`,
      intro: `Country-filtered templates keep other regions off the wheel when your quiz is ${countryLabel.toLowerCase()}-focused.`,
      points: [
        {
          title: "Focused pool",
          description: `Only ${countryLabel.toLowerCase()}s from the curated dataset.`,
        },
        {
          title: "Classroom ready",
          description: "Equal odds and Elimination Mode for fair multi-round games.",
        },
        {
          title: "Quick decisions",
          description: "Spin a fair pick without scrolling through all countries.",
        },
      ],
    },
    faqLabel: `${countryLabel} Picker Wheel`,
  })
}

export const STATE_WHEEL_SPOKES: Record<StateWheelSpokeId, StateWheelSpokeSeo> = {
  all: finalize({
    id: "all",
    path: STATE_WHEEL_PATH,
    accent: "sky",
    pageTitle: STATE_WHEEL_PAGE_TITLE,
    description:
      "Free random state picker. Spin all 50 US states or filter by any of 28 supported countries for fair, instant picks.",
    h1: "State Picker Wheel",
    shortTitle: "State Picker Wheel",
    heroIntro:
      "Need a random state? This page loads all 50 US states by default so you can spin a fair pick for quizzes, classrooms, and games.",
    keywords: ["state picker wheel", "random state", "us state picker wheel"],
    articleTitle: "Random State Picker Wheel hub",
    articleIntro: [
      "This is the State Picker Wheel hub — all 50 US states on one spinner by default. Switch country in Inputs for other regions.",
    ],
    uniqueSection: {
      title: "Built for state picks",
      intro: "Start here for all US states, then jump to country-filtered templates.",
      points: [
        { title: "50 US states", description: "Full dataset on one spinner by default." },
        { title: "28 countries", description: "Filter to provinces, regions, and prefectures." },
        { title: "Fair odds", description: "Equal chance per enabled state." },
      ],
    },
  }),

  us: countrySpoke("us", "/us-state-picker-wheel", "US State", "state", "blue"),
  canada: countrySpoke("canada", "/canada-province-picker-wheel", "Canada Province", "province", "emerald"),
  australia: countrySpoke("australia", "/australia-state-picker-wheel", "Australia State", "state", "amber"),
  uk: countrySpoke("uk", "/uk-region-picker-wheel", "UK Region", "region", "rose"),
  india: countrySpoke("india", "/india-state-picker-wheel", "India State", "state", "orange"),
  germany: countrySpoke("germany", "/germany-state-picker-wheel", "Germany State", "state", "teal"),
  japan: countrySpoke("japan", "/japan-prefecture-picker-wheel", "Japan Prefecture", "prefecture", "violet"),

  random: finalize({
    id: "random",
    path: "/random-state-picker-wheel",
    accent: "indigo",
    pageTitle: "Random State Picker Wheel | Spin a Random US State",
    description: "Spin a random US state instantly — fair picks for trivia, games, and classroom activities.",
    h1: "Random State Picker Wheel",
    shortTitle: "Random State Picker",
    heroIntro: "Cannot decide on a state? Spin a random US state from the full 50-state list.",
    keywords: ["random state picker wheel", "random us state", "spin random state"],
    articleTitle: "Random state spins",
    articleIntro: [
      "This spoke focuses on random-US-state energy — same fair spinner, full 50-state pool.",
    ],
    uniqueSection: {
      title: "Built for random picks",
      intro: "Quick spins for instant fair state selection.",
      points: [
        { title: "US focus", description: "Full 50-state US pool by default." },
        { title: "Elimination", description: "Remove winners across planning rounds." },
        { title: "Shareable", description: "Results history for group chats." },
      ],
    },
  }),
}

export function getStateWheelSpoke(id: StateWheelSpokeId): StateWheelSpokeSeo {
  return STATE_WHEEL_SPOKES[id]
}

export function getAllStateWheelSpokes(): StateWheelSpokeSeo[] {
  return ALL_IDS.map((id) => STATE_WHEEL_SPOKES[id])
}

export function getStateSpokeSiblings(spoke: StateWheelSpokeSeo): StateWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => STATE_WHEEL_SPOKES[id])
}

export const STATE_WHEEL_POPULAR_SPOKE_LINKS: {
  id: StateWheelSpokeId
  href: string
  label: string
  description: string
  accent: StateWheelUseCaseAccent
}[] = (
  [
    "all",
    "us",
    "canada",
    "australia",
    "uk",
    "india",
    "germany",
    "japan",
    "random",
  ] as StateWheelSpokeId[]
).map((id) => {
  const s = STATE_WHEEL_SPOKES[id]
  return {
    id,
    href: s.path,
    label: s.shortTitle,
    description: s.heroIntro.slice(0, 90),
    accent: s.accent,
  }
})
