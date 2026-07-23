import { HOME_SITE_URL } from "@/lib/home-seo"

// ─── URLs ───────────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_SITE_URL = HOME_SITE_URL
export const WEIGHTED_WHEEL_PATH = "/weighted-wheel-spinner"
export const WEIGHTED_WHEEL_URL = `${WEIGHTED_WHEEL_SITE_URL}${WEIGHTED_WHEEL_PATH}`
export const WEIGHTED_WHEEL_OG_IMAGE_URL = `${WEIGHTED_WHEEL_SITE_URL}/og/weighted-wheel-spinner.svg`

// ─── Twin "Rigged" path ──────────────────────────────────────────────────────
export const RIGGED_PATH = "/rigged-wheel-spinner"
export const RIGGED_URL = `${WEIGHTED_WHEEL_SITE_URL}${RIGGED_PATH}`

// ─── Main page metadata ──────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_SHORT_TITLE = "Weighted Wheel Spinner"

export const WEIGHTED_WHEEL_PAGE_TITLE =
  "Weighted Wheel Spinner | Customize Winning Odds Online Free"

export const WEIGHTED_WHEEL_H1 = "Weighted Wheel Spinner"

export const WEIGHTED_WHEEL_PAGE_DESCRIPTION =
  "Set custom weights on any spinner entry and let probability do the work. Perfect for game design, classroom activities, probability demonstrations, and business scenario testing — all in your browser, free."

// ─── Rigged twin page metadata ───────────────────────────────────────────────
export const RIGGED_PAGE_TITLE =
  "Rigged Wheel Spinner | Create a Weighted Spin Wheel"

export const RIGGED_H1 = "Rigged Wheel Spinner"

export const RIGGED_DESCRIPTION =
  "Build a spin wheel where each entry has its own probability weight. Assign exact percentages to outcomes for classroom probability lessons, tabletop RPG loot tables, software testing scenarios, and interactive simulations — no coding required."

// ─── Hero intro ──────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_HERO_INTRO =
  "The Weighted Wheel Spinner lets you assign custom probability weights to every entry so higher-weight options appear more often. Use it for tabletop RPG loot tables, classroom probability exercises, scenario simulations, and business testing — all with full transparency about how the odds work."

// ─── Disclaimer ──────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_DISCLAIMER =
  "For raffles, giveaways, and contests where fairness matters, we recommend using a standard equal-probability wheel so every participant has the same chance of winning."

// ─── Keywords ────────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_KEYWORDS = [
  "weighted wheel spinner",
  "probability wheel",
  "custom odds wheel",
  "weighted spin wheel",
  "weighted random picker",
  "chance wheel",
  "percentage wheel",
  "probability spinner",
  "odds wheel",
  "weighted random wheel",
  "custom probability wheel",
  "loot table wheel",
  "random event wheel",
  "prize probability wheel",
  "weighted picker",
] as const

// ─── On-this-page anchors ─────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_ON_THIS_PAGE = [
  { id: "weighted-spin-wheel", label: "Spin the Weighted Wheel" },
  { id: "weighted-how-it-works", label: "How the Weighted Wheel works" },
  { id: "weighted-templates", label: "Popular weight templates" },
  { id: "weighted-use-cases", label: "Common uses for a Weighted Wheel" },
  { id: "weighted-equal-vs-weighted", label: "Equal odds vs weighted odds" },
  { id: "weighted-related", label: "Related tools" },
  { id: "weighted-faq", label: "FAQ" },
] as const

// ─── How it works steps ───────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_HOW_IT_WORKS = [
  "Add your entries in the Inputs panel — any labels you like.",
  "Set a numeric weight for each entry (higher = more likely to be picked).",
  "Click Equalize to reset all weights to equal, or tweak each one individually.",
  "Spin — the wheel selects an outcome proportional to each entry's weight.",
  "Save your setup locally or share a link so anyone can run the same weighted spin.",
] as const

// ─── Feature list ─────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_FEATURES = [
  {
    title: "Custom weight per entry",
    description:
      "Assign any positive integer or decimal as a weight. The wheel automatically converts weights to percentages so you always see the real probability.",
  },
  {
    title: "Percentage display",
    description:
      "Every entry shows its probability percentage live as you edit weights — no mental arithmetic needed.",
  },
  {
    title: "Equalize in one click",
    description:
      "Reset all weights to equal odds instantly with the Equalize button — great for switching between weighted and fair modes.",
  },
  {
    title: "Local save & share",
    description:
      "Your wheel is saved in your browser automatically. Share a URL to let others spin the same configuration.",
  },
  {
    title: "Reset to equal odds",
    description:
      "One-tap reset to equal probability — recommended before any raffle or giveaway.",
  },
  {
    title: "Templates",
    description:
      "Start from prebuilt setups like RPG loot tables, classroom reward wheels, and scenario-testing distributions.",
  },
] as const

// ─── Use-cases copy ───────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_USE_CASES_COPY = [
  {
    title: "Game Design & RPG",
    description:
      "Build weighted loot tables where common items drop more frequently than rare ones. Perfect for tabletop RPGs, boardgame prototypes, and classroom probability games.",
  },
  {
    title: "Education & Probability",
    description:
      "Demonstrate how probability distributions work in math and statistics classes. Students can see how changing weights shifts outcomes over many spins.",
  },
  {
    title: "Business & Testing",
    description:
      "Model traffic distributions, A/B test splits, or weighted scenario routing. Useful for QA engineers, product managers, and UX researchers.",
  },
  {
    title: "Entertainment & Creative",
    description:
      "Run weighted story prompts, creative writing constraints, or character trait generators where some outcomes appear more than others for dramatic effect.",
  },
] as const

// ─── Equal vs weighted comparison ─────────────────────────────────────────────
export const WEIGHTED_WHEEL_EQUAL_VS_WEIGHTED = [
  {
    aspect: "Fairness",
    equal: "Every entry has the same chance — ideal for giveaways and raffles.",
    weighted: "Each entry has a custom probability — ideal for simulations and games.",
  },
  {
    aspect: "Best for",
    equal: "Contests, random decisions, classrooms, group picks.",
    weighted: "Loot tables, probability demos, scenario testing, creative generators.",
  },
  {
    aspect: "Setup time",
    equal: "Instant — just add entries and spin.",
    weighted: "A few extra seconds to assign weights to each entry.",
  },
  {
    aspect: "Transparency",
    equal: "Participants can see every option is equally likely.",
    weighted:
      "Percentages are shown per entry so probabilities are fully transparent.",
  },
  {
    aspect: "Recommended for raffles",
    equal: "✓ Yes — use Equal odds for fair participant selection.",
    weighted: "✗ Not recommended — unequal odds are unfair to participants.",
  },
] as const

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a Weighted Wheel Spinner?",
    answer:
      "A Weighted Wheel Spinner lets you assign custom probability weights to each entry so some outcomes appear more often than others when you spin. It is used for loot tables, probability education, scenario testing, and creative generators.",
  },
  {
    question: "How do weights work?",
    answer:
      "Each entry has a positive numeric weight. The wheel converts weights to percentages internally: an entry with weight 3 out of a total of 10 has a 30% chance. You can see the percentage next to every entry as you edit.",
  },
  {
    question: "What is the Equalize button?",
    answer:
      "Equalize resets every entry to the same weight so all entries have equal probability. Use it to quickly switch between a weighted simulation and a fair equal-odds spin.",
  },
  {
    question: "Should I use weighted odds for a raffle or giveaway?",
    answer:
      "No. For raffles and giveaways where fairness matters, use equal odds so every participant has the same chance. Weighted wheels are designed for simulations, games, and educational demonstrations — not fair draws.",
  },
  {
    question: "Can I save my weight configuration?",
    answer:
      "Yes. Your wheel is saved automatically in your browser's local storage. You can also share a URL so others load the same weighted configuration.",
  },
  {
    question: "What is the Rigged Wheel Spinner page?",
    answer:
      "The Rigged Wheel Spinner is a twin page for the same weighted wheel tool. It targets the search term people use when they mean 'a wheel where some outcomes are more likely' — it is the same transparent probability tool, not a cheat device.",
  },
  {
    question: "Is the percentage calculation accurate?",
    answer:
      "Yes. Percentages are calculated from weights in real time: each entry's percentage equals its weight divided by the sum of all weights, multiplied by 100.",
  },
  {
    question: "Can I use this for a probability lesson?",
    answer:
      "Absolutely. Set weights to any values and ask students to predict outcome frequencies before spinning many times. The built-in percentage display makes the math visible and concrete.",
  },
  {
    question: "What is the difference between a weighted wheel and a random number generator?",
    answer:
      "Both produce random outcomes, but a weighted wheel shows you named options with custom probabilities and lets you spin visually. A number generator just outputs a number. Use the weighted wheel when you want labeled outcomes with adjustable odds.",
  },
  {
    question: "Is the Weighted Wheel Spinner free?",
    answer:
      "Yes. You can add entries, set weights, and spin without signing up or paying. Advanced features like cloud save may require an account in the future.",
  },
] as const

// ─── Link types ───────────────────────────────────────────────────────────────
export type WeightedWheelLinkItem = {
  label: string
  href: string
  description: string
}

// ─── Related tools ────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_RELATED_TOOLS: WeightedWheelLinkItem[] = [
  {
    label: "Random Name Picker",
    href: "/",
    description: "Classic equal-odds wheel for any custom list.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Pick random numbers for scoring or team sizes.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Quick binary decision spinner.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split people into fair random teams.",
  },
  {
    label: "Country Picker Wheel",
    href: "/country-picker-wheel",
    description: "Spin a random country from around the world.",
  },
  {
    label: "State Picker Wheel",
    href: "/state-wheel",
    description: "Random US state or province from 28 countries.",
  },
]

// ─── Popular template links (pointing to spokes) ──────────────────────────────
export const WEIGHTED_WHEEL_POPULAR_TEMPLATES: WeightedWheelLinkItem[] = [
  {
    label: "50 / 50 Coin Flip",
    href: "/weighted-wheel-spinner?template=fifty-fifty",
    description: "Equal-weight Yes / No for pure 50-50 decisions.",
  },
  {
    label: "70 / 30 Split",
    href: "/weighted-wheel-spinner?template=seventy-thirty",
    description: "Classic probability split for demonstrations.",
  },
  {
    label: "RPG Loot Table",
    href: "/loot-wheel",
    description: "Common, Uncommon, Rare, Legendary drop rates.",
  },
  {
    label: "Classroom Rewards",
    href: "/weighted-wheel-spinner?template=classroom-reward",
    description: "Stickers, homework passes, extra recess, and mystery prizes.",
  },
  {
    label: "Prize Probability",
    href: "/prize-wheel-with-odds",
    description: "Consolation, mid prize, and grand prize tiers.",
  },
  {
    label: "Random Events",
    href: "/random-event-wheel",
    description: "Quiet days, twists, challenges, and boss events.",
  },
  {
    label: "Testing Scenarios",
    href: "/weighted-wheel-spinner?template=testing-scenario",
    description: "Happy path, edge case, and error path distributions.",
  },
]
