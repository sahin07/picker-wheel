import { HOME_SITE_URL } from "@/lib/home-seo"

// ─── URLs ───────────────────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_SITE_URL = HOME_SITE_URL
export const WEIGHTED_WHEEL_PATH = "/weighted-wheel-spinner"
export const WEIGHTED_WHEEL_URL = `${WEIGHTED_WHEEL_SITE_URL}${WEIGHTED_WHEEL_PATH}`
export const WEIGHTED_WHEEL_OG_IMAGE_URL = `${WEIGHTED_WHEEL_SITE_URL}/og/weighted-wheel-spinner.svg`

// ─── Twin "Rigged" path ──────────────────────────────────────────────────────
export const RIGGED_PATH = "/rigged-wheel-spinner"
export const RIGGED_URL = `${WEIGHTED_WHEEL_SITE_URL}${RIGGED_PATH}`

export type WeightedWheelLinkItem = {
  label: string
  href: string
  description: string
}

// ─── Main page metadata ──────────────────────────────────────────────────────
export const WEIGHTED_WHEEL_SHORT_TITLE = "Weighted Wheel Spinner"

export const WEIGHTED_WHEEL_PAGE_TITLE =
  "Weighted Wheel Spinner | Customize Winning Odds Online Free"

export const WEIGHTED_WHEEL_H1 = "Weighted Wheel Spinner"

export const WEIGHTED_WHEEL_PAGE_DESCRIPTION =
  "Set custom weights on any spinner entry and let probability do the work. Perfect for game design, classroom activities, probability demonstrations, and business scenario testing — all in your browser, free."

// ─── Rigged twin page metadata ───────────────────────────────────────────────
export const RIGGED_PAGE_TITLE =
  "Rigged Wheel Spinner - Free Weighted Spin Wheel with Custom Odds"

export const RIGGED_H1 = "Rigged Wheel Spinner (Weighted Spin Wheel)"

export const RIGGED_SHORT_TITLE = "Rigged Wheel Spinner"

export const RIGGED_DESCRIPTION =
  "Create a rigged wheel spinner with custom probabilities. Assign weights, control winning chances, preview odds, and spin a weighted wheel online for free."

export const RIGGED_HERO_INTRO =
  "A rigged wheel spinner is simply a weighted spin wheel: each option can have a different chance of winning. Unlike a fair random wheel where every slice is equal, you assign weights so some outcomes appear more often. That is not hidden cheating—it is transparent probability control for classroom games, loot tables, simulations, giveaways with custom odds, and game-balance tests."

export const RIGGED_KEYWORDS = [
  "rigged wheel spinner",
  "rigged spin wheel",
  "weighted wheel spinner",
  "weighted wheel picker",
  "wheel with custom probability",
  "biased wheel spinner",
  "unfair wheel spinner",
  "probability wheel",
  "custom odds wheel",
  "wheel spinner with weights",
  "wheel rigging tool",
  "weighted spin wheel",
  "custom probability wheel",
] as const

export const RIGGED_ON_THIS_PAGE = [
  { id: "rigged-spin-wheel", label: "Spin the Rigged Wheel" },
  { id: "rigged-what-it-is", label: "What a rigged wheel is" },
  { id: "rigged-how-it-works", label: "How weights become odds" },
  { id: "rigged-features", label: "Core features" },
  { id: "rigged-use-cases", label: "Common uses" },
  { id: "rigged-fair-vs", label: "Fair vs weighted" },
  { id: "rigged-howto", label: "How to create a weighted wheel" },
  { id: "rigged-related", label: "Related tools" },
  { id: "rigged-faq", label: "FAQ" },
] as const

export const RIGGED_HOW_IT_WORKS = [
  "Add your options in the Inputs panel—any labels you like.",
  "Assign a numeric weight to each option (higher weight = higher chance).",
  "Watch live percentages update as you edit—weights are converted into a full probability distribution.",
  "Use Equalize for fair mode (every option weight becomes equal), or keep custom odds for simulations and games.",
  "Spin the wheel. Results follow the weights you set, with sector sizes reflecting relative probability.",
] as const

export const RIGGED_FEATURES = [
  {
    title: "Custom weights per option",
    description:
      "Give each entry a weight such as 50, 25, 10, and 5. Higher weights win more often without needing to write code.",
  },
  {
    title: "Live percentage display",
    description:
      "See exact odds like 55.3% next to every option as you edit. No mental math—percentages recalculate instantly.",
  },
  {
    title: "Transparent odds preview",
    description:
      "Before you spin, review which options have the highest and lowest chances so the distribution is clear to creators and learners.",
  },
  {
    title: "Fair mode with Equalize",
    description:
      "One click resets every weight to equal probability when you need a fair draw instead of a weighted simulation.",
  },
  {
    title: "Live probability updates",
    description:
      "Change one weight and every other percentage updates immediately so the total distribution always adds up.",
  },
  {
    title: "Clear weight ≠ percentage lesson",
    description:
      "Weights are relative. Apple 10, Orange 20, Banana 70 becomes 10%, 20%, and 70% automatically—ideal for teaching probability.",
  },
  {
    title: "Templates & starting distributions",
    description:
      "Jump into practical setups like 70/30 splits, loot tables, classroom rewards, and scenario testing, then customize.",
  },
  {
    title: "Save, share, and keep spinning",
    description:
      "Keep your weighted setup in the browser, share a link, and use analytics after many spins to compare outcomes.",
  },
] as const

export const RIGGED_USE_CASES = [
  {
    title: "Classroom games & lessons",
    description:
      "Demonstrate probability with visible weights and percentages. Students can predict frequencies before spinning.",
  },
  {
    title: "Game balance & loot tables",
    description:
      "Make common rewards land more often than rare ones while keeping the odds honest and editable.",
  },
  {
    title: "Simulations & testing",
    description:
      "Model uneven scenarios for QA, product experiments, or creative generators where some outcomes should dominate.",
  },
  {
    title: "Custom-odds activities",
    description:
      "Run party games, decision wheels, or demos where you intentionally bias results—and show the percentages openly.",
  },
] as const

export const RIGGED_HOWTO_STEPS = [
  {
    name: "Open the Rigged Wheel Spinner",
    text: "Go to the Rigged Wheel Spinner page and start with the custom weighted setup or a popular template.",
  },
  {
    name: "Add your options",
    text: "Enter names or labels for every outcome you want on the wheel.",
  },
  {
    name: "Assign weights",
    text: "Set a higher weight for outcomes that should appear more often. Leave lower weights for rare results.",
  },
  {
    name: "Preview the percentages",
    text: "Check the live percentage next to each option so you understand the real odds before spinning.",
  },
  {
    name: "Spin or switch to fair mode",
    text: "Spin with custom odds, or click Equalize when you need every option to have the same chance.",
  },
] as const

export const RIGGED_RELATED_TOOLS: WeightedWheelLinkItem[] = [
  {
    label: "Random Wheel Spinner",
    href: "/",
    description: "Equal-odds random wheel for any custom list.",
  },
  {
    label: "Weighted Wheel Spinner",
    href: "/weighted-wheel-spinner",
    description: "Main hub for transparent custom-probability spins.",
  },
  {
    label: "Custom Wheel Spinner",
    href: "/create-custom-wheel-spinner",
    description: "Build and share a branded custom spin wheel.",
  },
  {
    label: "Decision Wheel",
    href: "/decision-wheel",
    description: "Spin among custom choices when you need a pick.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Quick decision spinner for binary choices.",
  },
  {
    label: "Name Picker Wheel",
    href: "/",
    description: "Pick a name fairly from a list.",
  },
  {
    label: "Color Wheel",
    href: "/color-picker-wheel",
    description: "Spin a random color for creative projects.",
  },
  {
    label: "Wheel of Fortune",
    href: "/wheel-of-fortune",
    description: "Customizable fortune-style decision wheel.",
  },
  {
    label: "Random Number Wheel",
    href: "/number-picker-wheel",
    description: "Draw a random number from a range.",
  },
]

export const RIGGED_FAQ_ITEMS = [
  {
    question: "What is a rigged wheel spinner?",
    answer:
      "A rigged wheel spinner is a wheel where each option can have a different chance of being selected. Instead of every slice having equal odds, you assign weights so some outcomes are more or less likely. On Spinifywheel, those odds are shown as live percentages.",
  },
  {
    question: "Is this wheel truly random?",
    answer:
      "The spin itself is random, but the probabilities are weighted according to the values you assign. Higher weights increase the chance of landing on that option.",
  },
  {
    question: "Can I make one option almost always win?",
    answer:
      "Yes. Give one option a much higher weight than the others so its percentage approaches most of the distribution. For a guaranteed fixed result, a dedicated fixed-result workflow is more appropriate than a weighted wheel.",
  },
  {
    question: "What's the difference between weighted and fair?",
    answer:
      "A fair wheel gives every option an equal chance of winning. A weighted (rigged) wheel lets each option have a different probability based on custom weights. Use Equalize to switch back to fair mode instantly.",
  },
  {
    question: "Can viewers tell the wheel is weighted?",
    answer:
      "This tool is built for transparency: creators see weights and percentages in the controls. If you present only the spinning wheel visually, the audience may not see the numbers—but the probabilities still follow the weights you set.",
  },
  {
    question: "Is this useful for giveaways?",
    answer:
      "It can be used for activities, classroom games, simulations, and demos where different entries need different chances. For fair raffles where every participant should have the same chance, use Equalize or an equal-odds name picker instead.",
  },
  {
    question: "Can I compare expected odds with real spins?",
    answer:
      "Yes. After many spins, use the wheel analytics and results history to see how often each option won compared with the percentages you assigned.",
  },
  {
    question: "Do weights have to be percentages?",
    answer:
      "No. Weights are relative. For example, Apple 10, Orange 20, and Banana 70 become 10%, 20%, and 70% automatically.",
  },
] as const

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
    href: "/spin-random-country-wheel",
    description: "Spin a random country from around the world.",
  },
  {
    label: "State Picker Wheel",
    href: "/spin-random-state-wheel",
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
