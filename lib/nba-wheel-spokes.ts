import { NBA_WHEEL_PATH, NBA_WHEEL_SITE_URL } from "@/lib/nba-wheel-seo"
import {
  NBA_WHEEL_USE_CASES,
  type NbaWheelUseCaseConfig,
  type NbaWheelUseCaseId,
} from "@/lib/nba-wheel-use-cases"

export type NbaWheelSpokeId = NbaWheelUseCaseId

export type NbaWheelDeepLink = {
  useCaseId: NbaWheelUseCaseId
  config: NbaWheelUseCaseConfig
}

export type NbaWheelSpokeFaq = {
  question: string
  answer: string
}

export type NbaWheelSpokeSeo = {
  id: NbaWheelSpokeId
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
  faq: readonly NbaWheelSpokeFaq[]
  siblingIds: readonly NbaWheelSpokeId[]
  deepLink: NbaWheelDeepLink
}

export function nbaSpokeUrl(path: string): string {
  return `${NBA_WHEEL_SITE_URL}${path}`
}

const ALL_IDS: NbaWheelSpokeId[] = NBA_WHEEL_USE_CASES.map((u) => u.id)

function siblingsExcept(id: NbaWheelSpokeId): NbaWheelSpokeId[] {
  return ALL_IDS.filter((s) => s !== id)
}

function configFor(id: NbaWheelUseCaseId): NbaWheelUseCaseConfig {
  const found = NBA_WHEEL_USE_CASES.find((u) => u.id === id)
  if (!found) throw new Error(`Missing NBA use case: ${id}`)
  return found.config
}

function baseFaq(label: string): readonly NbaWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made NBA Picker Wheel template. It opens with a matching team set so you can spin a fair random NBA franchise right away.`,
    },
    {
      question: "Can I change the teams after opening this page?",
      answer:
        "Yes. Add or remove franchises in the Inputs panel. Your edits stay on this device in My Wheels if you keep the wheel.",
    },
    {
      question: "Is the pick random?",
      answer:
        "Yes. When each team appears once with equal weight, every franchise on the wheel has an equal chance.",
    },
    {
      question: "Where is the main NBA Picker Wheel?",
      answer: `Open the NBA Picker Wheel pillar at ${NBA_WHEEL_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

export const NBA_WHEEL_SPOKES: Record<NbaWheelSpokeId, NbaWheelSpokeSeo> = {
  "all-teams": {
    id: "all-teams",
    path: "/random-nba-team-picker-wheel",
    pageTitle: "Random NBA Team Generator | Spin All 30 Franchises",
    description:
      "Free random NBA team generator. Spin all 30 National Basketball Association franchises for fantasy drafts, watch parties, and games—no signup required.",
    h1: "Random NBA Team Generator",
    shortTitle: "Random NBA Team",
    heroIntro:
      "Need any NBA club at random? This page loads all 30 franchises so you can spin a fair basketball pick for drafts, streams, and watch parties.",
    keywords: [
      "random nba team",
      "nba team generator",
      "nba team spinner",
      "random basketball team",
    ],
    articleTitle: "How to Pick a Random NBA Team",
    articleIntro: [
      "A random NBA team generator is the fastest way to choose a franchise without bias. Spin once for a watch-party side, or use elimination for multi-round picks.",
      "This page is a focused NBA Picker Wheel template—same spinner, preloaded with every club.",
    ],
    uniqueSection: {
      title: "Best for full-league spins",
      intro: "Use the full 30-team set whenever any franchise is fair game.",
      points: [
        {
          title: "Fantasy icebreakers",
          description: "Assign a random rooting interest before your draft.",
        },
        {
          title: "Streamer challenges",
          description: "Let the wheel decide the franchise for a playthrough.",
        },
        {
          title: "Party fairness",
          description: "Everyone sees the spin—no host favorites.",
        },
      ],
    },
    faq: baseFaq("Random NBA Team Generator"),
    siblingIds: siblingsExcept("all-teams"),
    deepLink: { useCaseId: "all-teams", config: configFor("all-teams") },
  },
  eastern: {
    id: "eastern",
    path: "/nba-eastern-conference-picker-wheel",
    pageTitle: "Eastern Conference NBA Picker Wheel | Random East Team Spinner",
    description:
      "Spin a random Eastern Conference NBA team. Fifteen East franchises on one fair wheel for drafts, brackets, and watch parties.",
    h1: "Eastern Conference NBA Picker Wheel",
    shortTitle: "Eastern Conference",
    heroIntro:
      "Load only the Eastern Conference and spin a fair East-side pick for fantasy drafts, playoff pools, and watch-party challenges.",
    keywords: [
      "eastern conference nba",
      "random eastern conference team",
      "nba east wheel",
      "eastern conference spinner",
    ],
    articleTitle: "Why Spin the Eastern Conference Only?",
    articleIntro: [
      "East-only templates keep Western clubs off the wheel when your pool, bracket, or challenge is conference-locked.",
      "Same NBA Picker Wheel tools—just fifteen Eastern franchises ready to spin.",
    ],
    uniqueSection: {
      title: "Built for East-side pools",
      intro: "Use this template when only Eastern Conference teams count.",
      points: [
        {
          title: "Conference drafts",
          description: "Assign East rooting interests without West noise.",
        },
        {
          title: "Playoff watch parties",
          description: "Spin a side when both teams are from the East.",
        },
        {
          title: "Division warm-ups",
          description: "Start East-wide, then narrow to Atlantic, Central, or Southeast.",
        },
      ],
    },
    faq: baseFaq("Eastern Conference NBA Picker Wheel"),
    siblingIds: siblingsExcept("eastern"),
    deepLink: { useCaseId: "eastern", config: configFor("eastern") },
  },
  western: {
    id: "western",
    path: "/nba-western-conference-picker-wheel",
    pageTitle: "Western Conference NBA Picker Wheel | Random West Team Spinner",
    description:
      "Spin a random Western Conference NBA team. Fifteen West franchises on one fair wheel for drafts, brackets, and watch parties.",
    h1: "Western Conference NBA Picker Wheel",
    shortTitle: "Western Conference",
    heroIntro:
      "Load only the Western Conference and spin a fair West-side pick for fantasy drafts, playoff pools, and watch-party challenges.",
    keywords: [
      "western conference nba",
      "random western conference team",
      "nba west wheel",
      "western conference spinner",
    ],
    articleTitle: "Why Spin the Western Conference Only?",
    articleIntro: [
      "West-only templates keep Eastern clubs off the wheel when your pool or challenge is conference-locked.",
      "Same NBA Picker Wheel tools—just fifteen Western franchises ready to spin.",
    ],
    uniqueSection: {
      title: "Built for West-side pools",
      intro: "Use this template when only Western Conference teams count.",
      points: [
        {
          title: "Conference drafts",
          description: "Assign West rooting interests without East noise.",
        },
        {
          title: "Playoff watch parties",
          description: "Spin a side when both teams are from the West.",
        },
        {
          title: "Division warm-ups",
          description: "Start West-wide, then narrow to Northwest, Pacific, or Southwest.",
        },
      ],
    },
    faq: baseFaq("Western Conference NBA Picker Wheel"),
    siblingIds: siblingsExcept("western"),
    deepLink: { useCaseId: "western", config: configFor("western") },
  },
  atlantic: {
    id: "atlantic",
    path: "/nba-atlantic-picker-wheel",
    pageTitle: "NBA Atlantic Division Picker Wheel | Random Atlantic Team Spinner",
    description:
      "Spin a random NBA Atlantic Division team. Five Eastern Atlantic franchises on one rivalry wheel.",
    h1: "NBA Atlantic Division Picker Wheel",
    shortTitle: "Atlantic Division",
    heroIntro:
      "Spin among the five Atlantic Division clubs—Boston, Brooklyn, New York, Philadelphia, and Toronto—for rivalry drafts and division challenges.",
    keywords: [
      "nba atlantic division",
      "atlantic division spinner",
      "random atlantic nba team",
      "celtics knicks rivalry wheel",
    ],
    articleTitle: "Atlantic Division Rivalry Spins",
    articleIntro: [
      "A five-team Atlantic wheel keeps every spin inside one of basketball’s oldest rivalries.",
      "Ideal for division watch parties and short elimination rounds.",
    ],
    uniqueSection: {
      title: "Five-team Atlantic set",
      intro: "Every spin stays inside the Eastern Atlantic.",
      points: [
        {
          title: "Rivalry nights",
          description: "Pick a side before a big Atlantic matchup.",
        },
        {
          title: "Quick eliminations",
          description: "Fewer teams means faster multi-round spins.",
        },
        {
          title: "Classroom drafts",
          description: "Small sets are easy to explain and fair to spin.",
        },
      ],
    },
    faq: baseFaq("NBA Atlantic Division Picker Wheel"),
    siblingIds: siblingsExcept("atlantic"),
    deepLink: { useCaseId: "atlantic", config: configFor("atlantic") },
  },
  central: {
    id: "central",
    path: "/nba-central-picker-wheel",
    pageTitle: "NBA Central Division Picker Wheel | Random Central Team Spinner",
    description:
      "Spin a random NBA Central Division team. Five Eastern Central franchises on one fair wheel.",
    h1: "NBA Central Division Picker Wheel",
    shortTitle: "Central Division",
    heroIntro:
      "Spin among the five Central Division clubs for Midwest rivalry drafts, watch parties, and short elimination rounds.",
    keywords: [
      "nba central division",
      "central division spinner",
      "random central nba team",
      "bulls bucks cavaliers wheel",
    ],
    articleTitle: "Central Division Spinner Uses",
    articleIntro: [
      "Central-only spins keep the wheel on Chicago, Cleveland, Detroit, Indiana, and Milwaukee.",
      "Use it when your challenge or pool is locked to the Eastern Central.",
    ],
    uniqueSection: {
      title: "Midwest rivalry focus",
      intro: "Keep every pick inside the Central Division.",
      points: [
        {
          title: "Division drafts",
          description: "Assign Central clubs without conference noise.",
        },
        {
          title: "Watch-party sides",
          description: "Spin a rooting interest for a Central matchup.",
        },
        {
          title: "Elimination games",
          description: "Five equal slices for quick knockout rounds.",
        },
      ],
    },
    faq: baseFaq("NBA Central Division Picker Wheel"),
    siblingIds: siblingsExcept("central"),
    deepLink: { useCaseId: "central", config: configFor("central") },
  },
  southeast: {
    id: "southeast",
    path: "/nba-southeast-picker-wheel",
    pageTitle: "NBA Southeast Division Picker Wheel | Random Southeast Team Spinner",
    description:
      "Spin a random NBA Southeast Division team. Five Eastern Southeast franchises on one fair wheel.",
    h1: "NBA Southeast Division Picker Wheel",
    shortTitle: "Southeast Division",
    heroIntro:
      "Spin among the five Southeast Division clubs for regional drafts, streams, and watch-party challenges.",
    keywords: [
      "nba southeast division",
      "southeast division spinner",
      "random southeast nba team",
      "hawks heat magic wheel",
    ],
    articleTitle: "Southeast Division Spinner Uses",
    articleIntro: [
      "Southeast-only spins keep the wheel on Atlanta, Charlotte, Miami, Orlando, and Washington.",
      "Same NBA Picker Wheel tools with a five-team regional set.",
    ],
    uniqueSection: {
      title: "Southeast regional set",
      intro: "Every spin stays inside the Eastern Southeast.",
      points: [
        {
          title: "Regional drafts",
          description: "Assign Southeast clubs for local watch parties.",
        },
        {
          title: "Streamer challenges",
          description: "Let the wheel pick a Southeast franchise.",
        },
        {
          title: "Fast eliminations",
          description: "Five equal chances per round.",
        },
      ],
    },
    faq: baseFaq("NBA Southeast Division Picker Wheel"),
    siblingIds: siblingsExcept("southeast"),
    deepLink: { useCaseId: "southeast", config: configFor("southeast") },
  },
  northwest: {
    id: "northwest",
    path: "/nba-northwest-picker-wheel",
    pageTitle: "NBA Northwest Division Picker Wheel | Random Northwest Team Spinner",
    description:
      "Spin a random NBA Northwest Division team. Five Western Northwest franchises on one fair wheel.",
    h1: "NBA Northwest Division Picker Wheel",
    shortTitle: "Northwest Division",
    heroIntro:
      "Spin among the five Northwest Division clubs for mountain-and-prairie rivalry drafts and watch parties.",
    keywords: [
      "nba northwest division",
      "northwest division spinner",
      "random northwest nba team",
      "nuggets timberwolves thunder wheel",
    ],
    articleTitle: "Northwest Division Spinner Uses",
    articleIntro: [
      "Northwest-only spins keep the wheel on Denver, Minnesota, Oklahoma City, Portland, and Utah.",
      "Ideal when your pool or challenge is locked to the Western Northwest.",
    ],
    uniqueSection: {
      title: "Northwest rivalry focus",
      intro: "Keep every pick inside the Northwest Division.",
      points: [
        {
          title: "Division drafts",
          description: "Assign Northwest clubs without West-wide noise.",
        },
        {
          title: "Watch-party sides",
          description: "Spin a rooting interest for a Northwest matchup.",
        },
        {
          title: "Elimination rounds",
          description: "Five equal slices for quick knockouts.",
        },
      ],
    },
    faq: baseFaq("NBA Northwest Division Picker Wheel"),
    siblingIds: siblingsExcept("northwest"),
    deepLink: { useCaseId: "northwest", config: configFor("northwest") },
  },
  pacific: {
    id: "pacific",
    path: "/nba-pacific-picker-wheel",
    pageTitle: "NBA Pacific Division Picker Wheel | Random Pacific Team Spinner",
    description:
      "Spin a random NBA Pacific Division team. Five Western Pacific franchises on one rivalry wheel.",
    h1: "NBA Pacific Division Picker Wheel",
    shortTitle: "Pacific Division",
    heroIntro:
      "Spin among the five Pacific Division clubs—including the Lakers, Clippers, Warriors, Kings, and Suns—for West Coast rivalry drafts.",
    keywords: [
      "nba pacific division",
      "pacific division spinner",
      "random pacific nba team",
      "lakers warriors rivalry wheel",
    ],
    articleTitle: "Pacific Division Rivalry Spins",
    articleIntro: [
      "A five-team Pacific wheel keeps every spin inside one of the league’s highest-profile divisions.",
      "Great for West Coast watch parties and short elimination challenges.",
    ],
    uniqueSection: {
      title: "Five-team Pacific set",
      intro: "Every spin stays inside the Western Pacific.",
      points: [
        {
          title: "Rivalry nights",
          description: "Pick a side before a big Pacific matchup.",
        },
        {
          title: "Streamer drafts",
          description: "Let the wheel choose a Pacific franchise.",
        },
        {
          title: "Quick eliminations",
          description: "Fewer teams means faster multi-round spins.",
        },
      ],
    },
    faq: baseFaq("NBA Pacific Division Picker Wheel"),
    siblingIds: siblingsExcept("pacific"),
    deepLink: { useCaseId: "pacific", config: configFor("pacific") },
  },
  southwest: {
    id: "southwest",
    path: "/nba-southwest-picker-wheel",
    pageTitle: "NBA Southwest Division Picker Wheel | Random Southwest Team Spinner",
    description:
      "Spin a random NBA Southwest Division team. Five Western Southwest franchises on one fair wheel.",
    h1: "NBA Southwest Division Picker Wheel",
    shortTitle: "Southwest Division",
    heroIntro:
      "Spin among the five Southwest Division clubs for Texas-and-beyond rivalry drafts, streams, and watch parties.",
    keywords: [
      "nba southwest division",
      "southwest division spinner",
      "random southwest nba team",
      "spurs mavericks rockets wheel",
    ],
    articleTitle: "Southwest Division Spinner Uses",
    articleIntro: [
      "Southwest-only spins keep the wheel on Dallas, Houston, Memphis, New Orleans, and San Antonio.",
      "Same NBA Picker Wheel tools with a five-team regional set.",
    ],
    uniqueSection: {
      title: "Southwest regional set",
      intro: "Every spin stays inside the Western Southwest.",
      points: [
        {
          title: "Regional drafts",
          description: "Assign Southwest clubs for local watch parties.",
        },
        {
          title: "Streamer challenges",
          description: "Let the wheel pick a Southwest franchise.",
        },
        {
          title: "Fast eliminations",
          description: "Five equal chances per round.",
        },
      ],
    },
    faq: baseFaq("NBA Southwest Division Picker Wheel"),
    siblingIds: siblingsExcept("southwest"),
    deepLink: { useCaseId: "southwest", config: configFor("southwest") },
  },
  champions: {
    id: "champions",
    path: "/nba-championship-winners-picker-wheel",
    pageTitle: "NBA Champions Picker Wheel | Spin Titled Franchises",
    description:
      "Spin among NBA franchises with at least one championship. A titled-club wheel for fantasy drafts, trivia, and watch parties.",
    h1: "NBA Champions Picker Wheel",
    shortTitle: "NBA Champions",
    heroIntro:
      "Load every franchise that has won at least one NBA title and spin a fair pick among championship clubs.",
    keywords: [
      "nba champions wheel",
      "nba championship winners",
      "titled nba franchises",
      "nba title spinner",
    ],
    articleTitle: "Spin Among Championship Franchises",
    articleIntro: [
      "The champions template filters out clubs still waiting on a title so every slice has hardware history.",
      "Use it for trivia nights, dynasty drafts, and “pick a champion” challenges.",
    ],
    uniqueSection: {
      title: "Built for titled clubs",
      intro: "Only franchises with one or more NBA championships appear.",
      points: [
        {
          title: "Trivia nights",
          description: "Spin a champion, then quiz the room.",
        },
        {
          title: "Dynasty drafts",
          description: "Assign a titled franchise for fantasy fun.",
        },
        {
          title: "Streamer themes",
          description: "Play as a random championship club.",
        },
      ],
    },
    faq: baseFaq("NBA Champions Picker Wheel"),
    siblingIds: siblingsExcept("champions"),
    deepLink: { useCaseId: "champions", config: configFor("champions") },
  },
}

export function getNbaWheelSpoke(id: NbaWheelSpokeId): NbaWheelSpokeSeo {
  return NBA_WHEEL_SPOKES[id]
}

export function getNbaSpokeSiblings(spoke: NbaWheelSpokeSeo): NbaWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => NBA_WHEEL_SPOKES[id])
}

export const NBA_WHEEL_POPULAR_SPOKE_LINKS = ALL_IDS.map((id) => {
  const spoke = NBA_WHEEL_SPOKES[id]
  const useCase = NBA_WHEEL_USE_CASES.find((u) => u.id === id)!
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})
