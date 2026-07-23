import {
  WEIGHTED_WHEEL_PAGE_TITLE,
  WEIGHTED_WHEEL_PATH,
  WEIGHTED_WHEEL_SITE_URL,
  RIGGED_PATH,
  RIGGED_PAGE_TITLE,
  RIGGED_H1,
  RIGGED_DESCRIPTION,
} from "@/lib/weighted-wheel-seo"
import {
  WEIGHTED_WHEEL_USE_CASES,
  getWeightedWheelUseCase,
  type WeightedWheelUseCaseAccent,
  type WeightedWheelUseCaseConfig,
  type WeightedWheelUseCaseId,
} from "@/lib/weighted-wheel-use-cases"

// ─── Types ────────────────────────────────────────────────────────────────────
export type WeightedWheelSpokeId =
  | "weighted"
  | "rigged"
  | "probability"
  | "weighted-random"
  | "odds"
  | "chance"
  | "percentage"
  | "prize-odds"
  | "loot"
  | "event"

export type WeightedWheelDeepLink = {
  useCaseId: WeightedWheelUseCaseId
  config: WeightedWheelUseCaseConfig
}

export type WeightedWheelSpokeFaq = {
  question: string
  answer: string
}

export type WeightedWheelSpokeSeo = {
  id: WeightedWheelSpokeId
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
  faq: readonly WeightedWheelSpokeFaq[]
  siblingIds: readonly WeightedWheelSpokeId[]
  deepLink: WeightedWheelDeepLink
  accent: WeightedWheelUseCaseAccent
}

// ─── URL helper ───────────────────────────────────────────────────────────────
export function weightedSpokeUrl(path: string): string {
  return `${WEIGHTED_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

// ─── Internal helpers ─────────────────────────────────────────────────────────
function configFor(id: WeightedWheelUseCaseId): WeightedWheelUseCaseConfig {
  const useCase = getWeightedWheelUseCase(id)
  if (!useCase) {
    return getWeightedWheelUseCase("custom")!.config
  }
  return useCase.config
}

const ALL_SPOKE_IDS: WeightedWheelSpokeId[] = [
  "weighted",
  "rigged",
  "probability",
  "weighted-random",
  "odds",
  "chance",
  "percentage",
  "prize-odds",
  "loot",
  "event",
]

function siblingsExcept(id: WeightedWheelSpokeId): WeightedWheelSpokeId[] {
  return ALL_SPOKE_IDS.filter((x) => x !== id).slice(0, 8)
}

type SpokeDraft = Omit<WeightedWheelSpokeSeo, "siblingIds" | "faq" | "deepLink"> & {
  faq?: readonly WeightedWheelSpokeFaq[]
  deepLink?: WeightedWheelDeepLink
}

function finalize(draft: SpokeDraft): WeightedWheelSpokeSeo {
  const fallbackUseCaseId: WeightedWheelUseCaseId = "custom"
  return {
    ...draft,
    faq: draft.faq ?? baseFaq(draft.h1),
    siblingIds: siblingsExcept(draft.id),
    deepLink: draft.deepLink ?? {
      useCaseId: fallbackUseCaseId,
      config: configFor(fallbackUseCaseId),
    },
  }
}

function baseFaq(label: string): WeightedWheelSpokeFaq[] {
  return [
    {
      question: `What is the ${label}?`,
      answer: `The ${label} is a free online spinner where you assign custom probability weights to each entry. Higher-weight entries are selected more often, making it ideal for probability education, game design, and scenario testing.`,
    },
    {
      question: "How do I change the probability of an outcome?",
      answer:
        "Edit the weight next to each entry in the Inputs panel. The wheel shows the resulting percentage live. Higher weight equals higher probability.",
    },
    {
      question: "Are the probabilities transparent?",
      answer:
        "Yes. Every entry displays its exact probability percentage so you always know the true odds before you spin.",
    },
    {
      question: "Can I reset to equal odds?",
      answer:
        "Yes. Click Equalize to set every entry to the same weight, producing a fair equal-probability spin.",
    },
    {
      question: "Is this suitable for a fair raffle?",
      answer:
        "Weighted wheels are designed for simulations and games, not fair draws. For raffles and giveaways, use the equal-odds main picker wheel so every participant has the same chance.",
    },
  ]
}

// ─── Spoke definitions ────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_SPOKES: Record<WeightedWheelSpokeId, WeightedWheelSpokeSeo> = {
  // Hub page
  weighted: finalize({
    id: "weighted",
    path: WEIGHTED_WHEEL_PATH,
    accent: "sky",
    pageTitle: WEIGHTED_WHEEL_PAGE_TITLE,
    description:
      "Assign custom probability weights to any list of entries and spin. Perfect for RPG loot tables, probability lessons, scenario testing, and creative generators.",
    h1: "Weighted Wheel Spinner",
    shortTitle: "Weighted Wheel Spinner",
    heroIntro:
      "The Weighted Wheel Spinner lets you control the probability of each outcome. Set weights, see live percentages, and spin — ideal for game design, classroom probability demos, and business scenario testing.",
    keywords: [
      "weighted wheel spinner",
      "probability wheel",
      "custom odds wheel",
      "weighted random picker",
    ],
    articleTitle: "Weighted Wheel Spinner hub",
    articleIntro: [
      "This is the main Weighted Wheel Spinner. Add entries, assign weights, and see probability percentages update in real time.",
      "Choose a prebuilt template to get started quickly, or build your own weighted setup from scratch.",
    ],
    uniqueSection: {
      title: "Probability control at a glance",
      intro: "Every entry shows its exact probability so there are no surprises before you spin.",
      points: [
        {
          title: "Live percentages",
          description: "Weights convert to percentages automatically as you type.",
        },
        {
          title: "Equalize one click",
          description: "Reset all weights to equal odds instantly.",
        },
        {
          title: "Transparent outcomes",
          description: "All probabilities are visible — no hidden biases.",
        },
      ],
    },
  }),

  // Twin "rigged" page
  rigged: finalize({
    id: "rigged",
    path: RIGGED_PATH,
    accent: "rose",
    pageTitle: RIGGED_PAGE_TITLE,
    description: RIGGED_DESCRIPTION,
    h1: RIGGED_H1,
    shortTitle: "Rigged Wheel Spinner",
    heroIntro:
      "Create a spin wheel where each outcome has its own probability. Assign weights, view exact percentages, and spin — no coding needed. Perfect for classroom probability exercises, game loot tables, and software test scenario modelling.",
    keywords: [
      "rigged wheel spinner",
      "weighted spin wheel",
      "custom probability wheel",
      "rigged spinner",
      "weighted wheel",
    ],
    articleTitle: "Rigged Wheel Spinner — transparent probability control",
    articleIntro: [
      "The Rigged Wheel Spinner is the same weighted-probability tool as the main hub, optimised for people searching for a wheel where some results are intentionally more likely.",
      "Every probability is shown as a percentage so the 'rigging' is fully visible — it is a legitimate simulation tool, not a cheat device.",
    ],
    uniqueSection: {
      title: "Honest probability, not hidden cheating",
      intro:
        "Calling it 'rigged' simply means the odds are not equal — and we display every probability openly.",
      points: [
        {
          title: "Visible odds",
          description: "Every entry's percentage is shown before you spin.",
        },
        {
          title: "Editable weights",
          description: "Change any weight at any time to adjust probabilities.",
        },
        {
          title: "Equal-odds reset",
          description: "Equalize all weights for a fair spin whenever you need it.",
        },
      ],
    },
    deepLink: {
      useCaseId: "custom",
      config: configFor("custom"),
    },
    faq: [
      {
        question: "What is a Rigged Wheel Spinner?",
        answer:
          "A Rigged Wheel Spinner is a weighted spin wheel where each entry has a custom probability. 'Rigged' here means intentionally unequal odds — all probabilities are displayed openly, making it a transparent simulation tool rather than a cheat device.",
      },
      {
        question: "How do I set the probabilities?",
        answer:
          "Assign a numeric weight to each entry in the Inputs panel. The wheel converts weights to percentages automatically so you always see the true probability.",
      },
      {
        question: "Can I use this for a classroom probability demonstration?",
        answer:
          "Yes. Set different weights and ask students to predict outcomes before spinning multiple times. The live percentage display makes the underlying maths concrete and visible.",
      },
      {
        question: "Is it appropriate to use a weighted wheel for a raffle?",
        answer:
          "No. For raffles and giveaways use an equal-odds wheel so every participant has the same chance of winning. Weighted wheels are for simulations, games, and educational demonstrations.",
      },
      {
        question: "Can I share my weighted configuration?",
        answer:
          "Yes. Share the URL from the address bar to let others load and spin the same configuration.",
      },
    ],
  }),

  // Probability spoke
  probability: finalize({
    id: "probability",
    path: "/probability-wheel",
    accent: "blue",
    pageTitle: "Probability Wheel | Weighted Spinner for Math & Science",
    description:
      "Build a probability wheel with custom weights for maths lessons, statistics demonstrations, and science experiments. See live percentage breakdowns as you adjust.",
    h1: "Probability Wheel",
    shortTitle: "Probability Wheel",
    heroIntro:
      "A probability wheel that shows exact percentages for every entry. Adjust weights and watch the probabilities update in real time — ideal for maths classrooms and statistics lessons.",
    keywords: [
      "probability wheel",
      "weighted probability spinner",
      "math probability wheel",
      "statistics wheel",
      "chance wheel online",
    ],
    articleTitle: "Probability Wheel for education and demonstration",
    articleIntro: [
      "This spoke is tuned for probability education. Load the 70/30 preset or start from scratch and set weights that match your lesson plan.",
      "Students can see how changing weights shifts outcome frequencies over many spins — making abstract probability concepts concrete.",
    ],
    uniqueSection: {
      title: "Built for probability learning",
      intro: "Live percentage display makes theoretical probability visible and interactive.",
      points: [
        {
          title: "Real-time percentages",
          description: "Edit a weight and see every percentage recalculate instantly.",
        },
        {
          title: "Law of large numbers",
          description: "Spin many times to see results approach the expected probabilities.",
        },
        {
          title: "Comparison mode",
          description: "Equalize weights mid-lesson to contrast equal and unequal distributions.",
        },
      ],
    },
    deepLink: {
      useCaseId: "seventy-thirty",
      config: configFor("seventy-thirty"),
    },
  }),

  // Weighted random spoke
  "weighted-random": finalize({
    id: "weighted-random",
    path: "/weighted-random-picker",
    accent: "indigo",
    pageTitle: "Weighted Random Picker | Spin with Custom Probabilities",
    description:
      "Pick random outcomes where each option has a custom probability. Enter your items, set weights, and spin for a weighted random result.",
    h1: "Weighted Random Picker",
    shortTitle: "Weighted Random Picker",
    heroIntro:
      "Need a random result where some options are more likely than others? The Weighted Random Picker lets you set any probability distribution and spin a fair weighted result instantly.",
    keywords: [
      "weighted random picker",
      "weighted random generator",
      "random picker with odds",
      "probability picker",
      "weighted randomizer",
    ],
    articleTitle: "Weighted Random Picker — custom probability distributions",
    articleIntro: [
      "The Weighted Random Picker is the same transparent weighted wheel focused on picking named outcomes with custom probabilities.",
      "Use it whenever you want a random pick that is not uniformly distributed — RPG events, software testing, creative prompts, and more.",
    ],
    uniqueSection: {
      title: "Custom distributions for any use case",
      intro:
        "Uniform random is not always what you need — set exact probabilities to match your scenario.",
      points: [
        {
          title: "Any distribution",
          description: "Set weights to match any probability distribution you need.",
        },
        {
          title: "Named outcomes",
          description: "Label each outcome for clear, readable results.",
        },
        {
          title: "Save & share",
          description: "Bookmark or share your weighted configuration with a URL.",
        },
      ],
    },
    deepLink: {
      useCaseId: "custom",
      config: configFor("custom"),
    },
  }),

  // Odds spoke
  odds: finalize({
    id: "odds",
    path: "/random-wheel-with-odds",
    accent: "teal",
    pageTitle: "Random Wheel with Odds | Set Custom Chances per Entry",
    description:
      "Spin a random wheel where each entry has its own odds. Set weights, view percentages, and spin for weighted random results in games, simulations, and lessons.",
    h1: "Random Wheel with Odds",
    shortTitle: "Wheel with Odds",
    heroIntro:
      "A random wheel where you control the odds. Assign custom weights to every entry, see the resulting percentages, and spin — the outcome is random but follows the probabilities you set.",
    keywords: [
      "random wheel with odds",
      "wheel with custom odds",
      "odds spinner",
      "weighted odds wheel",
      "random spinner odds",
    ],
    articleTitle: "Random Wheel with Odds — controlled randomness",
    articleIntro: [
      "A random wheel with odds gives you controlled randomness: outcomes are still random but follow the probability distribution you define.",
      "Useful anywhere you want non-uniform randomness — loot tables, classroom activities, scenario generators, and testing workflows.",
    ],
    uniqueSection: {
      title: "Controlled randomness, transparent odds",
      intro: "Every entry shows its exact odds so participants always know the probabilities.",
      points: [
        {
          title: "Set exact odds",
          description: "Weights convert to precise percentages shown next to every entry.",
        },
        {
          title: "Spin & verify",
          description: "Run many spins and compare results against expected probabilities.",
        },
        {
          title: "Equal-odds toggle",
          description: "Equalize in one click for a standard fair spinner.",
        },
      ],
    },
    deepLink: {
      useCaseId: "seventy-thirty",
      config: configFor("seventy-thirty"),
    },
  }),

  // Chance spoke
  chance: finalize({
    id: "chance",
    path: "/chance-wheel",
    accent: "orange",
    pageTitle: "Chance Wheel | Spin a Weighted Probability Wheel Online",
    description:
      "A chance wheel with custom probability weights for each entry. Perfect for classroom chance experiments, board game mechanics, and interactive probability demonstrations.",
    h1: "Chance Wheel",
    shortTitle: "Chance Wheel",
    heroIntro:
      "Spin a chance wheel where each outcome has its own probability. Set weights, see exact percentages, and explore how chance works in maths, games, and real-life simulations.",
    keywords: [
      "chance wheel",
      "chance spinner",
      "probability chance wheel",
      "random chance wheel",
      "weighted chance spinner",
    ],
    articleTitle: "Chance Wheel — probability made visual",
    articleIntro: [
      "The Chance Wheel makes probability tangible. Assign weights, then spin many times to observe how frequently each outcome actually occurs.",
      "Great for introducing the concept of chance in primary and secondary education, or for adding weighted randomness to board game prototypes.",
    ],
    uniqueSection: {
      title: "Explore chance with visual feedback",
      intro: "Spinning many times shows how theoretical probability and actual results compare.",
      points: [
        {
          title: "Visual probability",
          description: "Sector sizes reflect weights so you can see differences at a glance.",
        },
        {
          title: "Classroom experiments",
          description: "Compare predicted vs actual frequencies across spin runs.",
        },
        {
          title: "Board game prototyping",
          description: "Test weighted event triggers for game mechanics quickly.",
        },
      ],
    },
    deepLink: {
      useCaseId: "fifty-fifty",
      config: configFor("fifty-fifty"),
    },
  }),

  // Percentage spoke
  percentage: finalize({
    id: "percentage",
    path: "/percentage-wheel",
    accent: "purple" as WeightedWheelUseCaseAccent,
    pageTitle: "Percentage Wheel | Spin with Exact Percentage Odds",
    description:
      "Build a spin wheel with exact percentage odds per entry. Enter percentages, spin, and demonstrate probability distributions in classrooms, simulations, and presentations.",
    h1: "Percentage Wheel",
    shortTitle: "Percentage Wheel",
    heroIntro:
      "A spin wheel driven by exact percentages. Enter how often you want each outcome to appear, and the wheel distributes probability accordingly — live percentage display included.",
    keywords: [
      "percentage wheel",
      "percentage spinner",
      "spin wheel percentages",
      "probability percentage wheel",
      "weighted percentage spinner",
    ],
    articleTitle: "Percentage Wheel — spin by exact probability",
    articleIntro: [
      "The Percentage Wheel is the clearest way to set spin probabilities: input the percentage you want for each entry and the weights are calculated automatically.",
      "Ideal for presentations, lessons, and simulations where the audience needs to see exact probability figures.",
    ],
    uniqueSection: {
      title: "Exact percentages, no guesswork",
      intro: "Enter the probability you want — the wheel handles the rest.",
      points: [
        {
          title: "Percentage-first input",
          description: "Weights are translated to percentages shown clearly next to every entry.",
        },
        {
          title: "Presentation-ready",
          description: "Show stakeholders or students the exact probability before each spin.",
        },
        {
          title: "Full transparency",
          description: "All percentages sum to 100 — no hidden rounding surprises.",
        },
      ],
    },
    deepLink: {
      useCaseId: "seventy-thirty",
      config: configFor("seventy-thirty"),
    },
  }),

  // Prize odds spoke
  "prize-odds": finalize({
    id: "prize-odds",
    path: "/prize-wheel-with-odds",
    accent: "amber",
    pageTitle: "Prize Wheel with Odds | Set Probability per Prize Tier",
    description:
      "A prize wheel where each tier has a custom probability. Set consolation, mid, and grand prize weights for game mechanics, classroom challenges, and event entertainment.",
    h1: "Prize Wheel with Odds",
    shortTitle: "Prize Wheel with Odds",
    heroIntro:
      "Assign probability weights to each prize tier and spin. Consolation prizes land more often than grand prizes — just like real prize wheels in game mechanics and classroom challenges.",
    keywords: [
      "prize wheel with odds",
      "prize probability wheel",
      "weighted prize spinner",
      "prize wheel percentages",
      "prize tier wheel",
    ],
    articleTitle: "Prize Wheel with Odds — tiered probability for games",
    articleIntro: [
      "The Prize Wheel with Odds lets you model realistic prize-tier distributions: common consolation prizes, occasional mid-tier prizes, and rare grand prizes.",
      "Use it for classroom reward systems, game mechanics, and event entertainment where prize rarity adds excitement.",
    ],
    uniqueSection: {
      title: "Tiered prize probabilities",
      intro: "Rare grand prizes make wins feel special — weighted odds control the rarity.",
      points: [
        {
          title: "Rarity control",
          description: "Set grand prize weight low and consolation weight high for realistic tiers.",
        },
        {
          title: "Classroom rewards",
          description: "Fun reward wheel for student achievements with varied prize values.",
        },
        {
          title: "Event entertainment",
          description: "Live spin events where prize rarity builds audience excitement.",
        },
      ],
    },
    deepLink: {
      useCaseId: "prize-probability",
      config: configFor("prize-probability"),
    },
    faq: [
      {
        question: "What is a Prize Wheel with Odds?",
        answer:
          "A Prize Wheel with Odds is a spin wheel where each prize tier has a custom probability weight. Grand prizes have low weight (rare) and consolation prizes have high weight (common), matching how real prize distributions work in games and events.",
      },
      {
        question: "Should I use this for a raffle?",
        answer:
          "No. For a fair raffle every participant should have an equal chance. Use the standard equal-odds picker wheel for raffles and giveaways. A weighted prize wheel is designed for game mechanics and educational simulations.",
      },
      {
        question: "Can I add custom prize names?",
        answer:
          "Yes. Edit the entry labels in the Inputs panel to match your prize names — Gift Card, Homework Pass, Mystery Box, and so on.",
      },
      {
        question: "How do I make the grand prize rarer?",
        answer:
          "Lower the grand prize weight relative to the other entries. For example, Consolation: 50, Mid Prize: 35, Grand Prize: 15 gives a 15% grand prize chance.",
      },
      {
        question: "Are the probabilities visible to participants?",
        answer:
          "Yes. Every percentage is displayed next to each entry so participants can see the true odds before spinning.",
      },
    ],
  }),

  // Loot wheel spoke
  loot: finalize({
    id: "loot",
    path: "/loot-wheel",
    accent: "violet",
    pageTitle: "Loot Wheel | RPG Loot Table Spinner with Custom Drop Rates",
    description:
      "Spin a loot wheel with custom drop rates for Common, Uncommon, Rare, and Legendary items. Perfect for tabletop RPGs, boardgame prototypes, and game design education.",
    h1: "Loot Wheel",
    shortTitle: "Loot Wheel",
    heroIntro:
      "A loot table spinner with weighted drop rates. Common items drop most frequently, Legendary items rarely — just like RPG loot systems. Customise the tiers and weights to match your game design.",
    keywords: [
      "loot wheel",
      "loot table spinner",
      "rpg loot wheel",
      "weighted loot generator",
      "drop rate wheel",
      "rpg random loot",
    ],
    articleTitle: "Loot Wheel — weighted drop rates for games",
    articleIntro: [
      "The Loot Wheel simulates RPG loot tables with adjustable drop rates: Common 50%, Uncommon 30%, Rare 15%, Legendary 5% by default.",
      "Edit the weights to match your game system, prototype new loot tiers, or use it as a classroom introduction to weighted probability.",
    ],
    uniqueSection: {
      title: "Simulate realistic loot drops",
      intro: "Tiered rarity makes every rare drop feel earned — weighted probability in action.",
      points: [
        {
          title: "Four rarity tiers",
          description: "Common, Uncommon, Rare, Legendary — fully editable weights.",
        },
        {
          title: "Game design prototyping",
          description: "Test loot economy balance without writing code.",
        },
        {
          title: "Probability education",
          description: "A relatable context for teaching weighted random distributions.",
        },
      ],
    },
    deepLink: {
      useCaseId: "rpg-loot",
      config: configFor("rpg-loot"),
    },
    faq: [
      {
        question: "What is a Loot Wheel?",
        answer:
          "A Loot Wheel is a weighted spin wheel that simulates RPG loot table drop rates. Each rarity tier has a custom probability — Common items drop most often, Legendary items rarely.",
      },
      {
        question: "What are the default drop rates?",
        answer:
          "The default preset uses Common 50%, Uncommon 30%, Rare 15%, Legendary 5%. Edit any weight to adjust the distribution for your game system.",
      },
      {
        question: "Can I add custom item names?",
        answer:
          "Yes. Edit the entry labels to use specific item names — Healing Potion, Iron Sword, Enchanted Bow, Dragon Scale Armour, and so on.",
      },
      {
        question: "Can I use this for a classroom probability lesson?",
        answer:
          "Absolutely. Loot tables are an engaging real-world example of weighted probability. Students can set weights, predict outcome frequencies, and test their predictions by spinning.",
      },
      {
        question: "How do I add more rarity tiers?",
        answer:
          "Add a new entry in the Inputs panel, name it (e.g. Epic), and set a weight. The percentages for all tiers recalculate automatically.",
      },
    ],
  }),

  // Random event spoke
  event: finalize({
    id: "event",
    path: "/random-event-wheel",
    accent: "rose",
    pageTitle: "Random Event Wheel | Weighted Spinner for Game Events",
    description:
      "Spin a weighted random event wheel for tabletop games, classroom activities, and interactive simulations. Quiet days, twists, challenges, and boss events — each with custom probability.",
    h1: "Random Event Wheel",
    shortTitle: "Random Event Wheel",
    heroIntro:
      "A weighted random event spinner for game masters, teachers, and simulation designers. Set the probability of each event type and spin for varied, realistic-feeling outcomes.",
    keywords: [
      "random event wheel",
      "weighted event spinner",
      "rpg event wheel",
      "game event randomizer",
      "story event wheel",
      "random encounter wheel",
    ],
    articleTitle: "Random Event Wheel — weighted event generation",
    articleIntro: [
      "The Random Event Wheel generates weighted game and story events: Quiet Day, Twist, Challenge, and Boss Event each have their own probability.",
      "Low-probability boss events feel dramatic and earned; routine quiet days provide pacing — weighted randomness creates natural narrative rhythm.",
    ],
    uniqueSection: {
      title: "Narrative pacing through weighted events",
      intro: "Rarer high-impact events feel more meaningful when probability controls their frequency.",
      points: [
        {
          title: "Pacing control",
          description: "Set boss events rare and quiet days common for realistic game pacing.",
        },
        {
          title: "Classroom simulations",
          description: "Model real-world event probability for social studies or science lessons.",
        },
        {
          title: "Custom event types",
          description: "Rename any entry to match your specific game world or simulation scenario.",
        },
      ],
    },
    deepLink: {
      useCaseId: "random-event",
      config: configFor("random-event"),
    },
    faq: [
      {
        question: "What is a Random Event Wheel?",
        answer:
          "A Random Event Wheel is a weighted spin wheel that generates game or story events with custom probabilities. Less dramatic events occur more often; rare high-impact events occur infrequently — creating natural narrative rhythm.",
      },
      {
        question: "What are the default event types?",
        answer:
          "The default preset uses Quiet Day 40%, Twist 30%, Challenge 20%, Boss Event 10%. Edit any weight or label to match your specific game world.",
      },
      {
        question: "Can I add custom event names?",
        answer:
          "Yes. Edit the entry labels in the Inputs panel to use your specific event names — Storm, Merchant Visit, Ambush, Festival, Dragon Attack, and so on.",
      },
      {
        question: "Can teachers use this in the classroom?",
        answer:
          "Yes. Use it for probability lessons where events represent real-world scenarios, weather patterns, or historical event likelihoods. Students set weights and test their predictions.",
      },
      {
        question: "Is there a way to lock an event out temporarily?",
        answer:
          "Yes. Disable any entry in the Inputs panel to exclude it from the current spin pool without deleting it. Re-enable it whenever that event type becomes available again.",
      },
    ],
  }),
}

// ─── Public lookup helpers ────────────────────────────────────────────────────
export function getWeightedWheelSpoke(id: WeightedWheelSpokeId): WeightedWheelSpokeSeo {
  return WEIGHTED_WHEEL_SPOKES[id]
}

export function getAllWeightedWheelSpokes(): WeightedWheelSpokeSeo[] {
  return ALL_SPOKE_IDS.map((id) => WEIGHTED_WHEEL_SPOKES[id])
}

export function getWeightedSpokeSiblings(spoke: WeightedWheelSpokeSeo): WeightedWheelSpokeSeo[] {
  return (spoke.siblingIds as WeightedWheelSpokeId[]).map((id) => WEIGHTED_WHEEL_SPOKES[id])
}

// ─── Popular spoke links ──────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_POPULAR_SPOKE_LINKS: {
  id: WeightedWheelSpokeId
  href: string
  label: string
  description: string
  accent: WeightedWheelUseCaseAccent
}[] = ALL_SPOKE_IDS.map((id) => {
  const s = WEIGHTED_WHEEL_SPOKES[id]
  return {
    id,
    href: s.path,
    label: s.shortTitle,
    description: s.heroIntro.slice(0, 90),
    accent: s.accent,
  }
})
