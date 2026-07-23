import {
  FORTNITE_WHEEL_PATH,
  FORTNITE_WHEEL_SITE_URL,
} from "@/lib/fortnite-wheel-seo"
import {
  FORTNITE_WHEEL_USE_CASES,
  type FortniteWheelUseCaseConfig,
  type FortniteWheelUseCaseId,
} from "@/lib/fortnite-wheel-use-cases"
import { getFortniteChallengeSpokes } from "@/lib/fortnite-challenge-spokes-seo"
import { getFortniteExtraSpokes } from "@/lib/fortnite-extra-spokes-seo"
import type {
  FortniteWheelSpokeFaq,
  FortniteWheelSpokeSeo,
} from "@/lib/fortnite-wheel-spoke-types"

export type { FortniteWheelSpokeFaq, FortniteWheelSpokeSeo } from "@/lib/fortnite-wheel-spoke-types"

export type FortniteWheelSpokeId = FortniteWheelUseCaseId

export type FortniteWheelDeepLink = {
  useCaseId: FortniteWheelUseCaseId
  config: FortniteWheelUseCaseConfig
}

export function fortniteSpokeUrl(path: string): string {
  return `${FORTNITE_WHEEL_SITE_URL}${path}`
}

const ALL_IDS: FortniteWheelSpokeId[] = FORTNITE_WHEEL_USE_CASES.map((u) => u.id)

function siblingsExcept(id: FortniteWheelSpokeId): FortniteWheelSpokeId[] {
  return ALL_IDS.filter((s) => s !== id)
}

function configFor(id: FortniteWheelUseCaseId): FortniteWheelUseCaseConfig {
  const found = FORTNITE_WHEEL_USE_CASES.find((u) => u.id === id)
  if (!found) throw new Error(`Missing Fortnite use case: ${id}`)
  return found.config
}

function baseFaq(label: string): readonly FortniteWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made Fortnite Skins Picker template. It opens with a matching skin set so you can spin a fair random outfit right away.`,
    },
    {
      question: "Can I change the skins after opening this page?",
      answer:
        "Yes. Add or remove outfits in the Inputs panel. Your edits stay on this device in My Wheels if you keep the wheel.",
    },
    {
      question: "Is the pick random?",
      answer:
        "Yes. When each skin appears once with equal weight, every outfit on the wheel has an equal chance.",
    },
    {
      question: "Where is the main Fortnite Skins Picker?",
      answer: `Open the Fortnite Picker Wheel pillar at ${FORTNITE_WHEEL_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

export const FORTNITE_WHEEL_SPOKES: Record<
  FortniteWheelSpokeId,
  FortniteWheelSpokeSeo
> = {
  "all-skins": {
    id: "all-skins",
    path: "/random-fortnite-skin-picker-wheel",
    pageTitle: "Random Fortnite Skin Generator | Spin Any Outfit",
    description:
      "Free random Fortnite skin generator. Spin the full outfit catalog for streams, parties, and locker challenges—no signup required.",
    h1: "Random Fortnite Skin Generator",
    shortTitle: "Random Fortnite Skin",
    heroIntro:
      "Need any Fortnite outfit at random? This page loads the full skin set so you can spin a fair locker pick for streams, squads, and challenges.",
    keywords: [
      "random fortnite skin",
      "fortnite skin generator",
      "fortnite outfit spinner",
      "random fortnite outfit",
    ],
    articleTitle: "How to Pick a Random Fortnite Skin",
    articleIntro: [
      "A random Fortnite skin generator is the fastest way to choose an outfit without bias. Spin once for a stream challenge, or use elimination for multi-round locker games.",
      "This page is a focused Fortnite Skins Picker template—same spinner, preloaded with the full catalog.",
    ],
    uniqueSection: {
      title: "Best for full-locker spins",
      intro: "Use the full set whenever any outfit is fair game.",
      points: [
        {
          title: "Streamer challenges",
          description: "Let the wheel decide tonight’s locker look.",
        },
        {
          title: "Squad fairness",
          description: "Everyone sees the spin—no host favorites.",
        },
        {
          title: "Party icebreakers",
          description: "Pick a random flex before the first drop.",
        },
      ],
    },
    faq: baseFaq("Random Fortnite Skin Generator"),
    siblingIds: siblingsExcept("all-skins"),
    deepLink: { useCaseId: "all-skins", config: configFor("all-skins") },
  },
  common: {
    id: "common",
    path: "/fortnite-common-skins-picker-wheel",
    pageTitle: "Fortnite Common Skins Picker Wheel | Random Common Outfits",
    description:
      "Spin a Fortnite Common skins wheel. Random Common rarity outfits for default-energy challenges and party games.",
    h1: "Fortnite Common Skins Picker Wheel",
    shortTitle: "Common Skins",
    heroIntro:
      "Want a Common-only challenge? This template loads Common rarity Fortnite skins so you can spin a simple locker pick.",
    keywords: [
      "fortnite common skins",
      "common fortnite wheel",
      "default fortnite skin random",
    ],
    articleTitle: "Spin Common Fortnite Skins",
    articleIntro: [
      "Common skins keep challenges grounded—great for “default energy” streams and lighthearted party rounds.",
      "This spoke opens the Fortnite Skins Picker with Common rarity already selected.",
    ],
    uniqueSection: {
      title: "When to use Common-only",
      intro: "Keep the rarity floor low for fun constraints.",
      points: [
        {
          title: "Default challenges",
          description: "Force a humble look for one match or session.",
        },
        {
          title: "Warm-up spins",
          description: "Quick low-stakes picks before rarer templates.",
        },
        {
          title: "Classroom / kids parties",
          description: "Simple emoji-friendly options on the wheel.",
        },
      ],
    },
    faq: baseFaq("Fortnite Common Skins Picker Wheel"),
    siblingIds: siblingsExcept("common"),
    deepLink: { useCaseId: "common", config: configFor("common") },
  },
  uncommon: {
    id: "uncommon",
    path: "/fortnite-uncommon-skins-picker-wheel",
    pageTitle: "Fortnite Uncommon Skins Picker Wheel | Random Uncommon Outfits",
    description:
      "Spin a Fortnite Uncommon skins wheel. Random Uncommon rarity outfits for mid-light locker challenges.",
    h1: "Fortnite Uncommon Skins Picker Wheel",
    shortTitle: "Uncommon Skins",
    heroIntro:
      "Need an Uncommon-only Fortnite spinner? This page preloads Uncommon rarity skins for a fair random pick.",
    keywords: [
      "fortnite uncommon skins",
      "uncommon fortnite wheel",
      "random uncommon fortnite skin",
    ],
    articleTitle: "Spin Uncommon Fortnite Skins",
    articleIntro: [
      "Uncommon rarity is a sweet spot for light challenges without going full Legendary.",
      "Open this template whenever you want the Fortnite wheel locked to Uncommon outfits.",
    ],
    uniqueSection: {
      title: "Best Uncommon uses",
      intro: "Tight rarity, still plenty of personality.",
      points: [
        {
          title: "Holiday event vibes",
          description: "Many Uncommon skins lean seasonal and playful.",
        },
        {
          title: "Squad matching",
          description: "Spin matching rarity so nobody flexes too hard.",
        },
        {
          title: "Elimination rounds",
          description: "Remove winners until one Uncommon look remains.",
        },
      ],
    },
    faq: baseFaq("Fortnite Uncommon Skins Picker Wheel"),
    siblingIds: siblingsExcept("uncommon"),
    deepLink: { useCaseId: "uncommon", config: configFor("uncommon") },
  },
  rare: {
    id: "rare",
    path: "/fortnite-rare-skins-picker-wheel",
    pageTitle: "Fortnite Rare Skins Picker Wheel | Random Rare Outfits",
    description:
      "Spin a Fortnite Rare skins wheel. Random Rare rarity outfits for streams, parties, and locker picks.",
    h1: "Fortnite Rare Skins Picker Wheel",
    shortTitle: "Rare Skins",
    heroIntro:
      "Looking for a Rare-only Fortnite outfit spin? This template loads Rare rarity skins on the picker wheel.",
    keywords: [
      "fortnite rare skins",
      "rare fortnite wheel",
      "random rare fortnite skin",
    ],
    articleTitle: "Spin Rare Fortnite Skins",
    articleIntro: [
      "Rare skins land in the middle of the rarity ladder—flashy enough for streams, not limited to Mythic flex.",
      "This spoke is the same Fortnite Skins Picker with Rare preselected.",
    ],
    uniqueSection: {
      title: "Why Rare templates help",
      intro: "Narrow the locker without emptying it.",
      points: [
        {
          title: "Balanced challenges",
          description: "Mid-tier looks for fair viewer games.",
        },
        {
          title: "Faster decisions",
          description: "Fewer slices than the full catalog.",
        },
        {
          title: "Theme nights",
          description: "Pair with a Rare-only party rule.",
        },
      ],
    },
    faq: baseFaq("Fortnite Rare Skins Picker Wheel"),
    siblingIds: siblingsExcept("rare"),
    deepLink: { useCaseId: "rare", config: configFor("rare") },
  },
  epic: {
    id: "epic",
    path: "/fortnite-epic-skins-picker-wheel",
    pageTitle: "Fortnite Epic Skins Picker Wheel | Random Epic Outfits",
    description:
      "Spin a Fortnite Epic skins wheel. Random Epic rarity outfits for locker flex and stream challenges.",
    h1: "Fortnite Epic Skins Picker Wheel",
    shortTitle: "Epic Skins",
    heroIntro:
      "Want Epic rarity only? This Fortnite template loads Epic skins so you can spin a mid-high tier outfit at random.",
    keywords: [
      "fortnite epic skins",
      "epic fortnite wheel",
      "random epic fortnite skin",
    ],
    articleTitle: "Spin Epic Fortnite Skins",
    articleIntro: [
      "Epic skins are a popular challenge band for creators who want flash without Mythic-only rules.",
      "Use this page whenever your house rule is “Epic or bust.”",
    ],
    uniqueSection: {
      title: "Epic spinner ideas",
      intro: "Make Epic rarity the night’s theme.",
      points: [
        {
          title: "Viewer spin-ins",
          description: "Chat watches one fair Epic pick.",
        },
        {
          title: "Duo / trio matching",
          description: "Everyone spins Epic so squads stay coordinated.",
        },
        {
          title: "Shortlists",
          description: "Favorite Epics first, then spin the shortlist.",
        },
      ],
    },
    faq: baseFaq("Fortnite Epic Skins Picker Wheel"),
    siblingIds: siblingsExcept("epic"),
    deepLink: { useCaseId: "epic", config: configFor("epic") },
  },
  legendary: {
    id: "legendary",
    path: "/fortnite-legendary-skins-picker-wheel",
    pageTitle: "Fortnite Legendary Skins Picker Wheel | Random Legendary Outfits",
    description:
      "Spin a Fortnite Legendary skins wheel. Random Legendary rarity outfits for high-flex challenges and streams.",
    h1: "Fortnite Legendary Skins Picker Wheel",
    shortTitle: "Legendary Skins",
    heroIntro:
      "Ready for Legendary-only vibes? This page preloads Legendary Fortnite skins for a fair high-rarity spin.",
    keywords: [
      "fortnite legendary skins",
      "legendary fortnite wheel",
      "random legendary fortnite skin",
      "fortnite legendary spinner",
    ],
    articleTitle: "Spin Legendary Fortnite Skins",
    articleIntro: [
      "Legendary challenges are a staple for streamers and party hosts who want maximum locker energy.",
      "This spoke opens the Fortnite Skins Picker locked to Legendary rarity.",
    ],
    uniqueSection: {
      title: "Legendary challenge modes",
      intro: "High rarity, still fair odds.",
      points: [
        {
          title: "Streamer lock-ins",
          description: "Spin once and play the Legendary look all session.",
        },
        {
          title: "Elimination drafts",
          description: "Remove winners until one Legendary remains.",
        },
        {
          title: "Collab crossover",
          description: "Many collabs sit in Legendary—pair with Collab spoke.",
        },
      ],
    },
    faq: baseFaq("Fortnite Legendary Skins Picker Wheel"),
    siblingIds: siblingsExcept("legendary"),
    deepLink: { useCaseId: "legendary", config: configFor("legendary") },
  },
  mythic: {
    id: "mythic",
    path: "/fortnite-mythic-skins-picker-wheel",
    pageTitle: "Fortnite Mythic Skins Picker Wheel | Random Mythic Outfits",
    description:
      "Spin a Fortnite Mythic skins wheel. Random Mythic rarity outfits for elite locker challenges.",
    h1: "Fortnite Mythic Skins Picker Wheel",
    shortTitle: "Mythic Skins",
    heroIntro:
      "Need a Mythic-only Fortnite spinner? This template loads Mythic rarity skins for an elite random pick.",
    keywords: [
      "fortnite mythic skins",
      "mythic fortnite wheel",
      "random mythic fortnite skin",
    ],
    articleTitle: "Spin Mythic Fortnite Skins",
    articleIntro: [
      "Mythic skins are the top of the rarity ladder—perfect when the rule is “only the rarest.”",
      "This page is the Fortnite Skins Picker with Mythic preselected.",
    ],
    uniqueSection: {
      title: "Mythic-only moments",
      intro: "Small set, big flex.",
      points: [
        {
          title: "Finale spins",
          description: "Save Mythic for the last round of a party night.",
        },
        {
          title: "Boss-fight cosplay",
          description: "Spin a mythic look for a themed session.",
        },
        {
          title: "Collector games",
          description: "Compare Mythics side by side before you spin.",
        },
      ],
    },
    faq: baseFaq("Fortnite Mythic Skins Picker Wheel"),
    siblingIds: siblingsExcept("mythic"),
    deepLink: { useCaseId: "mythic", config: configFor("mythic") },
  },
  collabs: {
    id: "collabs",
    path: "/fortnite-collab-skins-picker-wheel",
    pageTitle: "Fortnite Collab Skins Picker Wheel | Marvel, DC & More",
    description:
      "Spin a Fortnite collab skins wheel. Random Marvel, DC, Star Wars, Dragon Ball, and event crossover outfits.",
    h1: "Fortnite Collab Skins Picker Wheel",
    shortTitle: "Collab Skins",
    heroIntro:
      "Want crossover energy only? This template loads Fortnite collab and event skins so you can spin a fair franchise flex.",
    keywords: [
      "fortnite collab skins",
      "fortnite marvel skins wheel",
      "fortnite crossover spinner",
      "random fortnite collab skin",
    ],
    articleTitle: "Spin Fortnite Collab Skins",
    articleIntro: [
      "Collab skins are perfect for themed nights—Marvel, DC, Star Wars, Dragon Ball, and seasonal events.",
      "This spoke preloads collab/event outfits on the Fortnite Skins Picker.",
    ],
    uniqueSection: {
      title: "Collab night ideas",
      intro: "Franchise vibes without rebuilding the list.",
      points: [
        {
          title: "Universe nights",
          description: "Marvel or Star Wars themed stream challenges.",
        },
        {
          title: "Holiday parties",
          description: "Seasonal event skins for festive lobby energy.",
        },
        {
          title: "Viewer votes",
          description: "Spin collabs so chat picks the crossover look.",
        },
      ],
    },
    faq: baseFaq("Fortnite Collab Skins Picker Wheel"),
    siblingIds: siblingsExcept("collabs"),
    deepLink: { useCaseId: "collabs", config: configFor("collabs") },
  },
  ...getFortniteChallengeSpokes(siblingsExcept),
  ...getFortniteExtraSpokes(siblingsExcept),
}

export function getFortniteWheelSpoke(
  id: FortniteWheelSpokeId,
): FortniteWheelSpokeSeo {
  return FORTNITE_WHEEL_SPOKES[id]
}

export function getFortniteSpokeSiblings(
  spoke: FortniteWheelSpokeSeo,
): FortniteWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => FORTNITE_WHEEL_SPOKES[id])
}

export function getFortniteWheelSpokeByPath(
  path: string,
): FortniteWheelSpokeSeo | undefined {
  return Object.values(FORTNITE_WHEEL_SPOKES).find((spoke) => spoke.path === path)
}

export const FORTNITE_WHEEL_SPOKE_PATHS = Object.values(FORTNITE_WHEEL_SPOKES).map(
  (spoke) => spoke.path,
)

export const FORTNITE_WHEEL_POPULAR_SPOKE_LINKS = ALL_IDS.map((id) => {
  const spoke = FORTNITE_WHEEL_SPOKES[id]
  const useCase = FORTNITE_WHEEL_USE_CASES.find((u) => u.id === id)!
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})
