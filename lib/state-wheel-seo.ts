import { HOME_SITE_URL } from "@/lib/home-seo"

export const STATE_WHEEL_SITE_URL = HOME_SITE_URL
export const STATE_WHEEL_PATH = "/state-wheel"
export const STATE_WHEEL_URL = `${STATE_WHEEL_SITE_URL}${STATE_WHEEL_PATH}`
export const STATE_WHEEL_OG_IMAGE_URL = `${STATE_WHEEL_SITE_URL}/og/state-picker-wheel.svg`

export const STATE_WHEEL_PAGE_TITLE =
  "State Picker Wheel | Spin a Random State or Province"

export const STATE_WHEEL_PAGE_DESCRIPTION =
  "Spin the State Picker Wheel to randomly choose a US state, Canadian province, Australian state, or region from 28 countries. Perfect for geography lessons, classroom activities, trivia games, and quick fair decisions."

export const STATE_WHEEL_H1 = "State Picker Wheel"

export const STATE_WHEEL_SHORT_TITLE = "State Picker Wheel"

export const STATE_WHEEL_HERO_INTRO =
  "Looking for a fun way to pick a random US state or province? The State Picker Wheel lets you spin a customizable wheel and instantly choose a state, province, or region from 28 countries. Perfect for geography quizzes, classroom games, trivia nights, and fair group decisions."

export const STATE_WHEEL_KEYWORDS = [
  "state picker wheel",
  "state wheel",
  "random state picker",
  "random state generator",
  "us state picker wheel",
  "spin a random state",
  "pick a random state",
  "50 states wheel",
  "state randomizer",
  "state spinner",
  "province picker wheel",
  "random province picker",
  "geography state wheel",
  "classroom state picker",
  "state capitals wheel",
  "us states quiz wheel",
  "random us state spinner",
  "state identification wheel",
] as const

export const STATE_WHEEL_ON_THIS_PAGE = [
  { id: "state-spin-wheel", label: "Spin the State Picker Wheel" },
  { id: "state-whats-on", label: "What you can put on the wheel" },
  { id: "state-features", label: "Features on this page" },
  { id: "state-create", label: "Create your own State Wheel" },
  { id: "state-popular", label: "Popular State Picker Wheels" },
  { id: "state-how-it-works", label: "How the State Picker Wheel works" },
  { id: "state-options", label: "How this tool's options work" },
  { id: "state-use-cases", label: "Common ways to use a State Picker Wheel" },
  { id: "state-why", label: "Why use a State Picker Wheel" },
  { id: "state-comparison", label: "State Picker Wheel vs random state generator" },
  { id: "state-tips", label: "Fairness tips & best practices" },
  { id: "state-customize", label: "Customize your State Picker Wheel" },
  { id: "state-related", label: "Related tools" },
  { id: "state-cluster", label: "State topic cluster" },
  { id: "state-faq", label: "FAQ" },
] as const

export type StateWheelLinkItem = {
  label: string
  href: string
  description: string
}

export const STATE_WHEEL_POPULAR_TEMPLATES: StateWheelLinkItem[] = [
  {
    label: "US States",
    href: "/us-state-picker-wheel",
    description: "All 50 US states on one fair spinner.",
  },
  {
    label: "Canada Provinces",
    href: "/canada-province-picker-wheel",
    description: "Canadian provinces and territories.",
  },
  {
    label: "Australia States",
    href: "/australia-state-picker-wheel",
    description: "Australian states and territories.",
  },
  {
    label: "UK Regions",
    href: "/uk-region-picker-wheel",
    description: "UK regions and countries.",
  },
  {
    label: "India States",
    href: "/india-state-picker-wheel",
    description: "Indian states and union territories.",
  },
  {
    label: "Germany States",
    href: "/germany-state-picker-wheel",
    description: "German federal states (Bundesländer).",
  },
  {
    label: "Japan Prefectures",
    href: "/japan-prefecture-picker-wheel",
    description: "All 47 Japanese prefectures.",
  },
]

export const STATE_WHEEL_ARTICLE_TITLE = "Spin the State Picker Wheel"

export const STATE_WHEEL_ARTICLE_INTRO = [
  "The State Picker Wheel turns a long states-and-provinces list into a visual, equal-odds spinner. Load all 50 US states—or a country-filtered template for Canada, Australia, India, Japan, and more—then spin to randomly select a state for geography games, classroom activities, trivia nights, and quick fair decisions.",
  "Teachers use it for capitals practice and report assignments. Families use it for road-trip games and quiz bowls. Groups use it whenever “which state?” needs a transparent pick everyone can watch.",
  "This page is an independent educational tool. State and province data is curated reference information for entertainment and learning—not official government statistics, election maps, or administrative boundary advice.",
] as const

export const STATE_WHEEL_WHATS_ON_WHEEL = [
  "State, province, prefecture, or region name for every curated entry.",
  "Country filter covering 28 countries—not only the United States.",
  "Capital city shown on the result card after each spin when available.",
  "Ready-made spoke templates: US 50, Canada, Australia, UK, India, Germany, Japan, and more.",
] as const

export const STATE_WHEEL_FEATURES_REAL = [
  {
    title: "Instant geography spin",
    description:
      "The interactive wheel sits above this guide. Load US states or another country template and spin without leaving the page.",
  },
  {
    title: "Country filters & templates",
    description:
      "Switch between 28 countries in Inputs, or open a dedicated spoke page when you only need one nation’s subdivisions.",
  },
  {
    title: "Capitals on the result card",
    description:
      "After a spin, read the state name with capital and country context—ideal for classroom call-and-response quizzes.",
  },
  {
    title: "Elimination & Results history",
    description:
      "Remove winners across rounds for multi-state projects, then review recent spins from Results.",
  },
  {
    title: "Text, Style & Sound",
    description:
      "Bulk-edit lists, recolor slices, toggle confetti and spin sounds, and go fullscreen for projectors or streams.",
  },
] as const

export const STATE_WHEEL_CREATE_POINTS = [
  "Start from all 50 US states or open a country spoke template.",
  "Filter by country in the Inputs sidebar to shrink the pool.",
  "Add, remove, or reorder states; bulk-edit names in the Text tab.",
  "Use Elimination Mode so each spin picks a new state for multi-round lessons.",
  "Save favorites and reuse custom lists in My Wheels.",
  "Share results and customize colors in Style / Themes.",
] as const

export const STATE_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your list",
    description:
      "Load all US states by default, pick a country filter, or open a popular template for Canada, Australia, India, Japan, and more.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Remove states you want to skip, reorder entries, set display and colors, and enable Elimination for unique picks each round.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click Spin or tap the wheel so the class or group sees a fair random state land live—duration and speed follow Settings.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Read the state name, capital, and country on the result card, then spin again, remove the winner, or open Results history.",
  },
] as const

export const STATE_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Pick a template or country filter",
    description:
      "Tap a Popular State template, filter by country in Inputs, or paste a custom list in the Text tab.",
  },
  {
    step: 2,
    title: "Tune fairness and style",
    description:
      "Enable Elimination, remove duplicates, set slice colors, and use fullscreen for classroom projectors.",
  },
  {
    step: 3,
    title: "Spin and review",
    description:
      "Spin once, check the capital on the result card, open Results history, and remove winners when you need unique picks.",
  },
  {
    step: 4,
    title: "Save or share",
    description:
      "Keep wheels in My Wheels on this device. Reuse the same shortlist for next week’s geography quiz or trivia night.",
  },
] as const

export const STATE_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Country filter",
    description:
      "Choose All or a single country in Inputs. The wheel rebuilds with only matching states, provinces, or regions.",
  },
  {
    title: "Include / exclude states",
    description:
      "Toggle entries in Inputs or bulk-edit names in the Text tab. Remove duplicates for strict equal odds.",
  },
  {
    title: "Display & colors",
    description:
      "Style tab sets how labels appear and which color themes paint the wheel wedges.",
  },
  {
    title: "Action Mode",
    description:
      "Normal keeps every state after a spin. Elimination removes the winner so the next spin draws from the remaining pool.",
  },
  {
    title: "Favorites & comparison",
    description:
      "Star states you revisit often and compare shortlists side by side when planning multi-state projects.",
  },
  {
    title: "Results history",
    description:
      "Open Results to recap recent spins—useful for quiz bowls, report assignments, and multi-round classroom games.",
  },
  {
    title: "Sound, confetti & speed",
    description:
      "Other Options and Header Settings share spinning duration, speed, sound, and confetti.",
  },
  {
    title: "Spoke templates",
    description:
      "Dedicated pages like /us-state-picker-wheel or /canada-province-picker-wheel load one country with matching SEO and defaults.",
  },
] as const

export const STATE_WHEEL_USE_CASES_COPY = [
  {
    title: "Geography Education",
    description:
      "Classroom quizzes, state identification, capitals practice, map warm-ups, and student research activities across 28 countries.",
  },
  {
    title: "Trivia & Games",
    description:
      "State guessing games, family trivia nights, party challenges, quiz bowl brackets, and educational board-game warm-ups.",
  },
  {
    title: "Classroom Decisions",
    description:
      "Randomly assign states for student reports, group presentations, debate topics, and multi-week project rotations.",
  },
  {
    title: "Travel & Road Trips",
    description:
      "Pick the next US stop, Canadian province, or Australian state when the group cannot agree on a destination.",
  },
  {
    title: "Content Creation",
    description:
      "YouTube geography challenges, TikTok “spin a state” clips, livestream quizzes, and educational shorts.",
  },
  {
    title: "Quick Fair Picks",
    description:
      "Any decision that needs a visible, equal-odds state pick—brackets, scavenger hunts, and group votes.",
  },
] as const

export const STATE_WHEEL_WHY_POINTS = [
  "Fair equal-odds spins—every enabled state has the same chance.",
  "Built for geography lessons about states, capitals, provinces, and prefectures.",
  "Covers 28 countries—not just the US—so one tool serves global classrooms.",
  "Easy to customize: filter by country, add, remove, and theme the wheel.",
  "Elimination Mode supports multi-round quizzes without repeating winners.",
  "Mobile friendly for phones, tablets, and classroom projectors.",
  "Free—no account needed to spin the basic wheel.",
] as const

export const STATE_WHEEL_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Interactive spinning everyone can watch live",
    generator: "Instant random result with one click",
  },
  {
    aspect: "Classrooms & groups",
    wheel: "Great for projectors, quizzes, and shared moments",
    generator: "Fast for solo use when you only need a quick pick",
  },
  {
    aspect: "Customization",
    wheel: "Country filters, templates, elimination, and themes",
    generator: "Usually fixed options with little editing",
  },
  {
    aspect: "Learning context",
    wheel: "Shows capital and country on the result card",
    generator: "Often plain text with no lesson-friendly framing",
  },
  {
    aspect: "Engagement",
    wheel: "More engaging—a shared buildup around the spin",
    generator: "Simpler interface, less visual ceremony",
  },
] as const

export const STATE_WHEEL_EEAT_TIPS = [
  {
    title: "Equal odds by default",
    description:
      "Every state appears once unless you customize the list. Duplicates increase odds for that slice—remove them in Manage if you want strict fairness.",
  },
  {
    title: "Classroom multi-round quizzes",
    description:
      "Use Elimination so each spin assigns a unique state for reports or map discussions. Open Results history to recap the full round.",
  },
  {
    title: "Capitals practice",
    description:
      "After each spin, ask students for the capital before revealing the result card—or flip the prompt and have them name the state from the capital.",
  },
  {
    title: "Country scope",
    description:
      "Filter to one country for focused lessons, or leave All for a global subdivision challenge. Spoke pages lock defaults for US, Canada, Australia, and more.",
  },
  {
    title: "Reference—not official data",
    description:
      "Capitals and names are curated for learning and entertainment. They are not live census, election, visa, or boundary-authority data.",
  },
] as const

export const STATE_WHEEL_RELATED_TOOLS: StateWheelLinkItem[] = [
  {
    label: "Country Picker Wheel",
    href: "/country-picker-wheel",
    description: "Spin a random country from around the world.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "The main picker wheel for any custom list.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Pick random numbers for scoring or team sizes.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split people into fair random teams.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Alphabet spins for naming games.",
  },
  {
    label: "Date Picker Wheel",
    href: "/date-picker-wheel",
    description: "Spin a random date for plans and challenges.",
  },
]

export const STATE_WHEEL_CLUSTER_LINKS: StateWheelLinkItem[] = [
  ...STATE_WHEEL_POPULAR_TEMPLATES,
  {
    label: "Random State Picker Wheel",
    href: "/random-state-picker-wheel",
    description: "Instant random US state spins for trivia and classroom picks.",
  },
]

export const STATE_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a State Picker Wheel?",
    answer:
      "A State Picker Wheel is a free online spinner that randomly chooses a state, province, prefecture, or region from a curated list. Load all 50 US states or filter by any of 28 supported countries.",
  },
  {
    question: "Does it include all 50 US states?",
    answer:
      "Yes. The US States template loads all 50 states so every spin covers the full set with equal odds.",
  },
  {
    question: "Which countries are supported?",
    answer:
      "The wheel supports 28 countries including the US, Canada, Australia, UK, India, Germany, Japan, and more. Filter by country in the Inputs sidebar or open a dedicated spoke page.",
  },
  {
    question: "Can I use it for geography class?",
    answer:
      "Yes. Teachers use it for state identification, capitals practice, map activities, multi-round quizzes with Elimination Mode, and randomly assigning states for student reports.",
  },
  {
    question: "Is every state equally likely to be selected?",
    answer:
      "Yes. Each enabled state on the wheel has equal odds. Deselect states or use Elimination Mode to change the pool after each spin.",
  },
  {
    question: "Can I spin only provinces for one country?",
    answer:
      "Yes. Use the country filter in Inputs or open a dedicated spoke page like /us-state-picker-wheel or /canada-province-picker-wheel.",
  },
  {
    question: "Does the result show the capital?",
    answer:
      "Yes. When capital data is available, the result card shows the state or province name with its capital and country for quick classroom follow-ups.",
  },
  {
    question: "Can I remove states before spinning?",
    answer:
      "Yes. Deselect states in Inputs or edit the list in the Text tab so removed names never appear on the wheel.",
  },
  {
    question: "Can I save my custom state wheel?",
    answer:
      "Yes. Use My Wheels / favorites to keep shortlists you reuse for quizzes, road trips, and streams.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The State Picker Wheel is mobile friendly for phones, tablets, and classroom projectors.",
  },
  {
    question: "Is the State Picker Wheel free?",
    answer:
      "Yes. You can spin and customize without paying. No account is required to use the basic wheel.",
  },
  {
    question: "Is this official government or census data?",
    answer:
      "No. This page is an independent educational spinner. State facts are curated for learning and entertainment—not official statistics, election maps, or administrative guidance.",
  },
] as const
