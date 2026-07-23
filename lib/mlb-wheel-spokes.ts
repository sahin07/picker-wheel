import { MLB_WHEEL_PATH, MLB_WHEEL_SITE_URL } from "@/lib/mlb-wheel-seo"
import {
  MLB_WHEEL_USE_CASES,
  type MlbWheelUseCaseConfig,
  type MlbWheelUseCaseId,
} from "@/lib/mlb-wheel-use-cases"

export type MlbWheelSpokeId = MlbWheelUseCaseId

export type MlbWheelDeepLink = {
  useCaseId: MlbWheelUseCaseId
  config: MlbWheelUseCaseConfig
}

export type MlbWheelSpokeFaq = {
  question: string
  answer: string
}

export type MlbWheelSpokeSeo = {
  id: MlbWheelSpokeId
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
  faq: readonly MlbWheelSpokeFaq[]
  siblingIds: readonly MlbWheelSpokeId[]
  deepLink: MlbWheelDeepLink
}

export function mlbSpokeUrl(path: string): string {
  return `${MLB_WHEEL_SITE_URL}${path}`
}

const ALL_IDS: MlbWheelSpokeId[] = MLB_WHEEL_USE_CASES.map((u) => u.id)

function siblingsExcept(id: MlbWheelSpokeId): MlbWheelSpokeId[] {
  return ALL_IDS.filter((s) => s !== id)
}

function configFor(id: MlbWheelUseCaseId): MlbWheelUseCaseConfig {
  const found = MLB_WHEEL_USE_CASES.find((u) => u.id === id)
  if (!found) throw new Error(`Missing MLB use case: ${id}`)
  return found.config
}

function baseFaq(label: string): readonly MlbWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made MLB Picker Wheel template. It opens with a matching team set so you can spin a fair random MLB franchise right away.`,
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
      question: "Where is the main MLB Picker Wheel?",
      answer: `Open the MLB Picker Wheel pillar at ${MLB_WHEEL_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

export const MLB_WHEEL_SPOKES: Record<MlbWheelSpokeId, MlbWheelSpokeSeo> = {
  "all-teams": {
    id: "all-teams",
    path: "/random-mlb-team-picker-wheel",
    pageTitle: "Random MLB Team Generator | Spin All 30 Franchises",
    description:
      "Free random MLB team generator. Spin all 30 Major League Baseball franchises for fantasy drafts, watch parties, and games—no signup required.",
    h1: "Random MLB Team Generator",
    shortTitle: "Random MLB Team",
    heroIntro:
      "Need any MLB club at random? This page loads all 30 franchises so you can spin a fair Major League pick for drafts, streams, and watch parties.",
    keywords: ["random mlb team", "mlb team generator", "mlb team spinner", "random baseball team"],
    articleTitle: "How to Pick a Random MLB Team",
    articleIntro: [
      "A random MLB team generator is the fastest way to choose a franchise without bias. Spin once for a watch-party side, or use elimination for multi-round picks.",
      "This page is a focused MLB Picker Wheel template—same spinner, preloaded with every club.",
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
    faq: baseFaq("Random MLB Team Generator"),
    siblingIds: siblingsExcept("all-teams"),
    deepLink: { useCaseId: "all-teams", config: configFor("all-teams") },
  },
  american: {
    id: "american",
    path: "/mlb-american-league-picker-wheel",
    pageTitle: "American League Picker Wheel | Random AL Team Spinner",
    description:
      "Spin a free American League wheel. Randomly pick an AL franchise for fantasy drafts, AL-only pools, and watch parties.",
    h1: "American League Picker Wheel",
    shortTitle: "American League",
    heroIntro:
      "Spin only American League clubs. This AL template loads 15 franchises so AL-only drafts and watch parties stay inside the junior circuit.",
    keywords: ["american league wheel", "al team spinner", "random al team", "american league picker"],
    articleTitle: "Random American League Teams",
    articleIntro: [
      "An American League wheel keeps National League clubs off the spinner—ideal for AL fantasy formats and ALCS watch parties.",
    ],
    uniqueSection: {
      title: "AL-ready defaults",
      intro: "Fifteen clubs, one fair spin.",
      points: [
        { title: "AL-only pools", description: "Keep the wheel inside the American League." },
        { title: "Draft nights", description: "Randomize AL franchise themes for managers." },
        { title: "Watch parties", description: "Pick an AL side before first pitch." },
      ],
    },
    faq: baseFaq("American League Picker Wheel"),
    siblingIds: siblingsExcept("american"),
    deepLink: { useCaseId: "american", config: configFor("american") },
  },
  national: {
    id: "national",
    path: "/mlb-national-league-picker-wheel",
    pageTitle: "National League Picker Wheel | Random NL Team Spinner",
    description:
      "Spin a free National League wheel. Randomly pick an NL franchise for fantasy drafts, NL-only pools, and watch parties.",
    h1: "National League Picker Wheel",
    shortTitle: "National League",
    heroIntro:
      "Spin only National League clubs. This NL template loads 15 franchises for NL drafts, NLCS nights, and National League challenges.",
    keywords: ["national league wheel", "nl team spinner", "random nl team", "national league picker"],
    articleTitle: "Random National League Teams",
    articleIntro: [
      "A National League wheel keeps American League clubs off the spinner for NL-only formats.",
    ],
    uniqueSection: {
      title: "NL-ready defaults",
      intro: "Fifteen clubs, one fair spin.",
      points: [
        { title: "NL-only pools", description: "Keep the wheel inside the National League." },
        { title: "Draft nights", description: "Randomize NL franchise themes for managers." },
        { title: "Watch parties", description: "Pick an NL side before first pitch." },
      ],
    },
    faq: baseFaq("National League Picker Wheel"),
    siblingIds: siblingsExcept("national"),
    deepLink: { useCaseId: "national", config: configFor("national") },
  },
  "al-east": {
    id: "al-east",
    path: "/mlb-al-east-picker-wheel",
    pageTitle: "AL East Picker Wheel | Random American League East Teams",
    description:
      "Spin the AL East: Yankees, Red Sox, Orioles, Rays, and Blue Jays. Free rivalry division spinner for baseball fans.",
    h1: "AL East Picker Wheel",
    shortTitle: "AL East",
    heroIntro:
      "Spin the American League East rivalry set—five clubs, one fair pick for drafts, bar bets, and division watch parties.",
    keywords: ["al east wheel", "al east spinner", "yankees red sox wheel", "american league east"],
    articleTitle: "Spin the AL East",
    articleIntro: ["A five-team AL East wheel keeps the famous East rivalry pool tight and fast."],
    uniqueSection: {
      title: "East rivalry picks",
      intro: "Built for the AL East.",
      points: [
        { title: "Five-team pool", description: "Only AL East franchises on the wheel." },
        { title: "Rivalry nights", description: "Fair picks when friends root for East clubs." },
        { title: "Quick spins", description: "Smaller wheels finish faster for parties." },
      ],
    },
    faq: baseFaq("AL East Picker Wheel"),
    siblingIds: siblingsExcept("al-east"),
    deepLink: { useCaseId: "al-east", config: configFor("al-east") },
  },
  "al-central": {
    id: "al-central",
    path: "/mlb-al-central-picker-wheel",
    pageTitle: "AL Central Picker Wheel | Random American League Central Teams",
    description:
      "Spin the AL Central division online. Free random picker for Guardians, Twins, Tigers, White Sox, and Royals.",
    h1: "AL Central Picker Wheel",
    shortTitle: "AL Central",
    heroIntro:
      "Spin the American League Central—five Midwest franchises for division drafts and watch-party picks.",
    keywords: ["al central wheel", "al central spinner", "american league central"],
    articleTitle: "Spin the AL Central",
    articleIntro: ["Load the AL Central when you want a tight Midwest division spinner."],
    uniqueSection: {
      title: "Central division defaults",
      intro: "Five AL Central clubs.",
      points: [
        { title: "Division pool", description: "Only AL Central franchises." },
        { title: "Party picks", description: "Fast spins for small groups." },
        { title: "Fantasy fun", description: "Randomize Central themes for managers." },
      ],
    },
    faq: baseFaq("AL Central Picker Wheel"),
    siblingIds: siblingsExcept("al-central"),
    deepLink: { useCaseId: "al-central", config: configFor("al-central") },
  },
  "al-west": {
    id: "al-west",
    path: "/mlb-al-west-picker-wheel",
    pageTitle: "AL West Picker Wheel | Random American League West Teams",
    description:
      "Spin the AL West online. Free random picker for Astros, Rangers, Mariners, Angels, and Athletics.",
    h1: "AL West Picker Wheel",
    shortTitle: "AL West",
    heroIntro:
      "Spin the American League West—five clubs for West Coast and Texas rivalry picks.",
    keywords: ["al west wheel", "al west spinner", "american league west"],
    articleTitle: "Spin the AL West",
    articleIntro: ["Use the AL West wheel for a five-team Western division pool."],
    uniqueSection: {
      title: "West division defaults",
      intro: "Five AL West clubs.",
      points: [
        { title: "Division pool", description: "Only AL West franchises." },
        { title: "Rivalry nights", description: "Fair picks among West clubs." },
        { title: "Quick drafts", description: "Small wheel, fast results." },
      ],
    },
    faq: baseFaq("AL West Picker Wheel"),
    siblingIds: siblingsExcept("al-west"),
    deepLink: { useCaseId: "al-west", config: configFor("al-west") },
  },
  "nl-east": {
    id: "nl-east",
    path: "/mlb-nl-east-picker-wheel",
    pageTitle: "NL East Picker Wheel | Random National League East Teams",
    description:
      "Spin the NL East: Braves, Phillies, Mets, Marlins, and Nationals. Free rivalry division spinner.",
    h1: "NL East Picker Wheel",
    shortTitle: "NL East",
    heroIntro:
      "Spin the National League East rivalry set—five clubs for drafts, streams, and watch parties.",
    keywords: ["nl east wheel", "nl east spinner", "national league east"],
    articleTitle: "Spin the NL East",
    articleIntro: ["A five-team NL East wheel keeps the East rivalry pool tight."],
    uniqueSection: {
      title: "East rivalry picks",
      intro: "Built for the NL East.",
      points: [
        { title: "Five-team pool", description: "Only NL East franchises." },
        { title: "Rivalry nights", description: "Fair picks among East clubs." },
        { title: "Quick spins", description: "Ideal for party rounds." },
      ],
    },
    faq: baseFaq("NL East Picker Wheel"),
    siblingIds: siblingsExcept("nl-east"),
    deepLink: { useCaseId: "nl-east", config: configFor("nl-east") },
  },
  "nl-central": {
    id: "nl-central",
    path: "/mlb-nl-central-picker-wheel",
    pageTitle: "NL Central Picker Wheel | Random National League Central Teams",
    description:
      "Spin the NL Central online. Free random picker for Cubs, Cardinals, Brewers, Reds, and Pirates.",
    h1: "NL Central Picker Wheel",
    shortTitle: "NL Central",
    heroIntro:
      "Spin the National League Central—five classic Midwest franchises on one wheel.",
    keywords: ["nl central wheel", "nl central spinner", "national league central"],
    articleTitle: "Spin the NL Central",
    articleIntro: ["Load the NL Central for a tight Midwest National League pool."],
    uniqueSection: {
      title: "Central division defaults",
      intro: "Five NL Central clubs.",
      points: [
        { title: "Division pool", description: "Only NL Central franchises." },
        { title: "Party picks", description: "Fast spins for small groups." },
        { title: "Fantasy fun", description: "Randomize Central themes." },
      ],
    },
    faq: baseFaq("NL Central Picker Wheel"),
    siblingIds: siblingsExcept("nl-central"),
    deepLink: { useCaseId: "nl-central", config: configFor("nl-central") },
  },
  "nl-west": {
    id: "nl-west",
    path: "/mlb-nl-west-picker-wheel",
    pageTitle: "NL West Picker Wheel | Random National League West Teams",
    description:
      "Spin the NL West online. Free random picker for Dodgers, Padres, Giants, Diamondbacks, and Rockies.",
    h1: "NL West Picker Wheel",
    shortTitle: "NL West",
    heroIntro:
      "Spin the National League West—five clubs for West Coast rivalry picks and fantasy fun.",
    keywords: ["nl west wheel", "nl west spinner", "national league west"],
    articleTitle: "Spin the NL West",
    articleIntro: ["Use the NL West wheel for a five-team Western National League pool."],
    uniqueSection: {
      title: "West division defaults",
      intro: "Five NL West clubs.",
      points: [
        { title: "Division pool", description: "Only NL West franchises." },
        { title: "Rivalry nights", description: "Fair picks among West clubs." },
        { title: "Quick drafts", description: "Small wheel, fast results." },
      ],
    },
    faq: baseFaq("NL West Picker Wheel"),
    siblingIds: siblingsExcept("nl-west"),
    deepLink: { useCaseId: "nl-west", config: configFor("nl-west") },
  },
  champions: {
    id: "champions",
    path: "/mlb-world-series-winners-picker-wheel",
    pageTitle: "World Series Winners Picker Wheel | MLB Champions Spinner",
    description:
      "Spin MLB franchises that have won at least one World Series. Free champions-only baseball team wheel.",
    h1: "World Series Winners Picker Wheel",
    shortTitle: "WS Champions",
    heroIntro:
      "Spin only titled clubs. This World Series winners template loads franchises with at least one championship for elite fantasy and trivia nights.",
    keywords: [
      "world series winners wheel",
      "mlb champions spinner",
      "mlb world series teams",
      "championship mlb teams",
    ],
    articleTitle: "Spin World Series Champions",
    articleIntro: [
      "A champions-only wheel skips never-titled franchises so every result has World Series history.",
    ],
    uniqueSection: {
      title: "Champions-only pool",
      intro: "Built for title-night fun.",
      points: [
        { title: "Titled clubs", description: "Only franchises with a World Series win." },
        { title: "Trivia nights", description: "Every result has championship lore." },
        { title: "Elite drafts", description: "Randomize among historic winners." },
      ],
    },
    faq: baseFaq("World Series Winners Picker Wheel"),
    siblingIds: siblingsExcept("champions"),
    deepLink: { useCaseId: "champions", config: configFor("champions") },
  },
}

export function getMlbWheelSpoke(id: MlbWheelSpokeId): MlbWheelSpokeSeo {
  return MLB_WHEEL_SPOKES[id]
}

export function getMlbSpokeSiblings(spoke: MlbWheelSpokeSeo): MlbWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => MLB_WHEEL_SPOKES[id])
}

export const MLB_WHEEL_POPULAR_SPOKE_LINKS = ALL_IDS.map((id) => {
  const spoke = MLB_WHEEL_SPOKES[id]
  const useCase = MLB_WHEEL_USE_CASES.find((u) => u.id === id)!
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})
