import { HOME_SITE_URL } from "@/lib/home-seo"

export const POKEMON_WHEEL_SITE_URL = HOME_SITE_URL

/** Canonical pillar path */
export const POKEMON_WHEEL_PATH = "/pokemon-picker-wheel"

export const POKEMON_WHEEL_URL = `${POKEMON_WHEEL_SITE_URL}${POKEMON_WHEEL_PATH}`

export const POKEMON_WHEEL_OG_IMAGE_URL = `${POKEMON_WHEEL_SITE_URL}/og/pokemon-picker-wheel.svg`

export const POKEMON_WHEEL_PAGE_TITLE =
  "Pokémon Picker Wheel | Spin a Random Pokémon Picker"

export const POKEMON_WHEEL_PAGE_DESCRIPTION =
  "Spin the Pokémon Picker Wheel to randomly choose Pokémon for games, challenges, team building, quizzes, or fun. Customize your own Pokémon picker with generations, types, or favorite Pokémon."

export const POKEMON_WHEEL_H1 = "Pokémon Picker Wheel"

export const POKEMON_WHEEL_SHORT_TITLE = "Pokémon Picker Wheel"

export const POKEMON_WHEEL_HERO_INTRO =
  "Can't decide which Pokémon to choose? Spin the Pokémon Picker Wheel and randomly select a Pokémon in seconds. Whether you're building a team, starting a challenge, creating content, playing with friends, or simply discovering a new favorite, this free Pokémon picker makes every spin exciting and completely random."

export const POKEMON_WHEEL_KEYWORDS = [
  "pokemon wheel",
  "pokémon wheel",
  "pokemon picker",
  "pokemon spinner",
  "pokemon picker wheel",
  "random pokemon picker",
  "random pokemon wheel",
  "spin pokemon wheel",
  "pokemon randomizer",
  "wheel spinner",
  "spin wheel",
  "pokemon team picker",
  "pokemon challenge wheel",
  "pokemon type wheel",
  "starter pokemon wheel",
  "favorite pokemon picker",
] as const

export const POKEMON_WHEEL_ON_THIS_PAGE = [
  { id: "pokemon-popular", label: "Popular Pokémon wheels" },
  { id: "pokemon-spin-wheel", label: "Spin the Pokémon Picker Wheel" },
  { id: "pokemon-whats-on", label: "What you can put on the wheel" },
  { id: "pokemon-features", label: "Features on this page" },
  { id: "pokemon-create", label: "Create your own Pokémon Picker Wheel" },
  { id: "pokemon-how-it-works", label: "How the Pokémon Picker Wheel works" },
  { id: "pokemon-options", label: "How this tool's options work" },
  { id: "pokemon-use-cases", label: "Common ways to use a Pokémon Picker Wheel" },
  { id: "pokemon-why", label: "Why use a Pokémon Picker Wheel" },
  { id: "pokemon-comparison", label: "Pokémon Picker Wheel vs random generator" },
  { id: "pokemon-tips", label: "Fairness tips & best practices" },
  { id: "pokemon-customize", label: "How to customize your wheel" },
  { id: "pokemon-related", label: "Related tools" },
  { id: "pokemon-cluster", label: "Pokémon topic cluster" },
  { id: "pokemon-faq", label: "FAQ" },
] as const

export type PokemonWheelLinkItem = {
  label: string
  href: string
  description: string
}

/** Popular templates — dedicated spoke URLs. */
export const POKEMON_WHEEL_POPULAR_TEMPLATES: PokemonWheelLinkItem[] = [
  {
    label: "All Pokémon",
    href: "/random-pokemon-generator-picker-wheel",
    description: "Full curated catalog on one fair spinner.",
  },
  {
    label: "Pokémon Picker",
    href: "/pokemon-picker",
    description: "Quick random Pokémon picker for any decision.",
  },
  {
    label: "Generation 1 Picker Wheel",
    href: "/generation-1-pokemon-picker-wheel",
    description: "Kanto classics — Gen 1 Pokémon only.",
  },
  {
    label: "Generation 2 Picker Wheel",
    href: "/generation-2-pokemon-picker-wheel",
    description: "Johto set for Gen 2 challenges.",
  },
  {
    label: "Generation 9 Picker Wheel",
    href: "/generation-9-pokemon-picker-wheel",
    description: "Paldea roster for current-gen spins.",
  },
  {
    label: "Starter Pokémon Picker Wheel",
    href: "/starter-pokemon-picker-wheel",
    description: "Starter lines for Nuzlocke and draft nights.",
  },
  {
    label: "Legendary Pokémon Picker Wheel",
    href: "/legendary-pokemon-picker-wheel",
    description: "Legendary picks for challenge runs and trivia.",
  },
  {
    label: "Mythical Pokémon Picker Wheel",
    href: "/mythical-pokemon-picker-wheel",
    description: "Mythical picks for collectors and themes.",
  },
  {
    label: "Pokémon Type Picker Wheel",
    href: "/pokemon-type-picker-wheel",
    description: "One iconic Pokémon per type for practice.",
  },
  {
    label: "Shiny Pokémon Picker Wheel",
    href: "/shiny-pokemon-picker-wheel",
    description: "Popular shiny-hunt challenge targets.",
  },
  {
    label: "Eeveelution Picker Wheel",
    href: "/eeveelution-picker-wheel",
    description: "Eevee and every Eeveelution on one spinner.",
  },
  {
    label: "Favorite Pokémon Picker",
    href: "/favorite-pokemon-picker-wheel",
    description: "High-popularity picks for community polls.",
  },
]

export const POKEMON_WHEEL_CREATE_POINTS = [
  {
    title: "Include the curated catalog",
    description:
      "Start with every Pokémon in our curated set on the wheel, then spin for a fully random pick.",
  },
  {
    title: "Filter by generation",
    description:
      "Switch to Gen 1–9 when you only want one region’s roster on the spinner.",
  },
  {
    title: "Filter by type or curated set",
    description:
      "Open type templates—or starters, legendaries, mythicals, Eeveelutions, and shiny-hunt targets—for tighter pools.",
  },
  {
    title: "Remove Pokémon",
    description:
      "Clear slices you do not want before spinning, or use Elimination Mode to remove winners after each spin.",
  },
  {
    title: "Add favorites",
    description:
      "Heart Pokémon into Favorites, compare entries side by side, and open the Favorite Pokémon Picker template for polls.",
  },
  {
    title: "Save custom wheels",
    description:
      "Keep custom Pokémon wheels in My Wheels on this device for the next challenge, draft, or stream.",
  },
] as const

export const POKEMON_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Generation filters",
    description:
      "Choose All Generations or Gen 1–9 to rebuild the wheel with matching Pokémon from that region’s curated set.",
  },
  {
    title: "Display Options",
    description:
      "Emoji & Name, Emoji Only, or Name Only controls how each slice appears while you spin and when a winner lands.",
  },
  {
    title: "Add to Favorites",
    description:
      "Tap the heart on any Pokémon in the Inputs list to star it. Open Favorites from the sidebar header to revisit creatures you care about for drafts or challenge runs.",
  },
  {
    title: "Pokémon Comparison",
    description:
      "Add up to four Pokémon to Comparison from the list or the compare control in the sidebar. The Comparison modal shows emoji, types, generation, and region side by side before you spin.",
  },
  {
    title: "Pokémon Details",
    description:
      "Open details from the list or after a spin to see identity facts: types, generation and region badges, starter or legendary flags, and popularity context. These are reference trivia for challenges and drafts—not live battle stats.",
  },
  {
    title: "Stats",
    description:
      "The Stats tab summarizes your current wheel—generation distribution, type counts, starters, legendaries, and region breakdowns—so you can sanity-check a pool before a multi-round draft.",
  },
  {
    title: "Manual vs AI-Powered",
    description:
      "Manual lets you select Pokémon yourself. AI-Powered can suggest balanced sets, type themes, or draft-style shortlists from the current generation filter.",
  },
  {
    title: "Action Mode & Game Mode",
    description:
      "Normal Mode keeps every Pokémon after a spin. Elimination Mode removes the winner for multi-round drafts. Manual Mode lets you type a name under the wheel. Game Mode on the wheel mirrors the same setting.",
  },
  {
    title: "Text, Style & Other",
    description:
      "Text tab bulk-edits the entry list. Style sets display mode and color palettes. Other Options toggles confetti and spin sound, plus import/export and fullscreen.",
  },
  {
    title: "Shuffle, Sort & Manage",
    description:
      "Shuffle randomizes slice order. Manage menu covers Sort Z–A, remove duplicates, clear all, and Remove winner (synced with Elimination).",
  },
  {
    title: "Results & Spin History",
    description:
      "Results (top-left of the wheel column) opens the last five winners with emoji and name. Spin History in the sidebar header shows past spins with a badge count.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips under the wheel open Achievements (points and theme unlocks), Analytics (spin trends and breakdowns), Social (profile and sharing), and Games (bingo and challenge modes).",
  },
  {
    title: "Wheel controls",
    description:
      "Mute toggles whoosh and win sounds. Fullscreen expands the spinner. STOP ends a spin early and locks in the Pokémon at the pointer. Click the wheel or Spin to start.",
  },
] as const

export const POKEMON_WHEEL_WHATS_ON_WHEEL = [
  "A curated Pokémon catalog with emoji, types, generation, and region metadata",
  "Generation filters — Gen 1 through Gen 9, or every curated entry on one spinner",
  "Type templates — Fire, Water, Grass, Electric, Psychic, Dragon, plus a Type Wheel hub",
  "Starter, legendary, mythical, shiny-hunt, and Eeveelution templates",
  "Favorites and comparison — shortlist Pokémon before you spin",
  "Custom text entries — add house-rule names or challenge prompts in the Text tab",
] as const

export const POKEMON_WHEEL_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive wheel sits above this guide. The curated catalog loads by default—spin without leaving the page.",
  },
  {
    title: "Generation and type filters",
    description:
      "Rebuild the wheel from the Inputs sidebar with Gen 1–9, a type template, or starters, legendaries, mythicals, and more.",
  },
  {
    title: "Details, stats & comparison",
    description:
      "Open Pokémon identity, types, generation, and region—plus side-by-side comparison and pool Stats.",
  },
  {
    title: "Elimination & Results history",
    description:
      "Remove winners across multi-round drafts; review recent spins from Results or Spin History.",
  },
  {
    title: "Display, sound & fullscreen",
    description:
      "Emoji & name, emoji only, or name only—plus confetti, mute, STOP, and fullscreen for streams and parties.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips open achievements, spin trends, Social sharing, and bingo-style challenge modes.",
  },
  {
    title: "My Wheels on this device",
    description:
      "Save generation filters and custom lists locally for the next Nuzlocke night or classroom session.",
  },
] as const

export const POKEMON_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your pool",
    description:
      "Start with the full catalog, filter to a generation, open a type template, or load starters and legendaries only.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Set emoji display, favorite Pokémon, enable elimination mode, and tune colors from Style.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click Spin or tap the wheel so everyone sees a fair random Pokémon land live.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Open details, assign a challenge pick, remove the winner, and spin again for the next round.",
  },
] as const

export const POKEMON_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Pick a template or filter",
    description:
      "Tap a Popular Pokémon template under Build Your Wheel, or set generation, type, starter, or legendary filters in Inputs.",
  },
  {
    step: 2,
    title: "Tune entries and style",
    description:
      "Remove Pokémon you do not need, enable elimination, set display mode, and use fullscreen for the room.",
  },
  {
    step: 3,
    title: "Spin and review",
    description:
      "Spin once, check Results history, compare favorites, and remove winners for multi-pick drafts.",
  },
  {
    step: 4,
    title: "Save for next run",
    description:
      "Keep your wheel in My Wheels on this device so the same generation or type pool opens instantly.",
  },
] as const

export const POKEMON_WHEEL_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Interactive spinning everyone can watch live",
    generator: "Instant random Pokémon with one click",
  },
  {
    aspect: "Streams & groups",
    wheel: "Great for streams, groups, and classroom spins",
    generator: "Better for quick solo picks",
  },
  {
    aspect: "Customization",
    wheel: "Customizable generations, types, and curated sets",
    generator: "Usually fixed settings",
  },
  {
    aspect: "Engagement",
    wheel: "More engaging—a shared moment around the spin",
    generator: "Simpler interface, less visual buildup",
  },
] as const

export const POKEMON_WHEEL_EEAT_TIPS = [
  {
    id: "pokemon-eeat-challenges",
    title: "Challenge runs",
    body: "Players use a Pokémon Picker Wheel for self-imposed challenges, themed teams, or replaying games with different rules. Spin a starter, type, or full-catalog pick, then commit to the result for the run.",
  },
  {
    id: "pokemon-eeat-teams",
    title: "Team building",
    body: "Spinning can inspire new team combinations without replacing strategic planning. Use the result as a seed—then build coverage, roles, and backups the way you normally would.",
  },
  {
    id: "pokemon-eeat-filters",
    title: "Filters that keep picks meaningful",
    body: "Narrow the wheel by generation, Pokémon type, legendary or mythical status, Eeveelutions, favorites, or shiny-hunt targets so random selections still fit your challenge rules.",
  },
  {
    id: "pokemon-eeat-randomness",
    title: "How randomness works",
    body: "Each enabled Pokémon on the wheel has an equal chance when it appears once. Duplicate entries or multiple slices for the same creature increase odds—use Remove duplicates in Manage for strict fairness.",
  },
  {
    id: "pokemon-eeat-fairness",
    title: "Best practices for fair picks",
    body: "Before a challenge draft or classroom spin, confirm everyone sees the same list. Announce results while the wheel is visible, and use elimination when each Pokémon should win only once.",
  },
  {
    id: "pokemon-eeat-disclaimer",
    title: "Fan tool disclaimer",
    body: "This is an independent fan tool for entertainment and education—not affiliated with Nintendo, Game Freak, The Pokémon Company, or related trademarks. Catalog facts are reference trivia for random selection, not official game data feeds.",
  },
] as const

export const POKEMON_WHEEL_USE_CASES = [
  {
    category: "Challenge runs",
    items: [
      "Random Pokémon challenge and themed runs",
      "Nuzlocke inspiration and gift picks",
      "Team-building ideas from fair spins",
      "Gym challenge and type-locked themes",
    ],
  },
  {
    category: "Gaming",
    items: [
      "Battle team selection icebreakers",
      "Pokémon tournament draft spins",
      "Multiplayer challenges with elimination mode",
      "Trading-game warm-ups (fan tool only—not card trading)",
    ],
  },
  {
    category: "Content creation",
    items: [
      "YouTube challenge segments",
      "Twitch stream spins viewers can watch",
      "TikTok and short-form decision clips",
      "Community events and Discord nights",
    ],
  },
  {
    category: "Learning & fun",
    items: [
      "Pokémon quizzes and trivia",
      "Type practice with the type wheel",
      "Family game nights",
      "Classroom activities and icebreakers",
    ],
  },
] as const

export const POKEMON_WHEEL_WHY_POINTS = [
  {
    title: "Fair random selection",
    description:
      "Every enabled Pokémon gets an equal spin chance—no host bias when friends argue over picks.",
  },
  {
    title: "Great for challenge runs",
    description:
      "Spin starters, types, legendaries, or full-catalog picks for Nuzlocke-style and self-imposed challenges.",
  },
  {
    title: "Fun for every generation",
    description:
      "Jump into Gen 1–9 templates, type wheels, Eeveelutions, and more without rebuilding the list each time.",
  },
  {
    title: "Easy to customize",
    description:
      "Remove Pokémon, add favorites, change display mode, and save wheels on this device.",
  },
  {
    title: "Mobile friendly",
    description:
      "Spin on phones, tablets, or a living-room TV browser—no app install required.",
  },
  {
    title: "Free to use",
    description:
      "The Pokémon Picker Wheel is free for challenges, classrooms, streams, and casual fun.",
  },
] as const

export const POKEMON_WHEEL_RELATED_TOOLS: PokemonWheelLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "Spin any custom list on the classic picker wheel.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split names into fair random teams.",
  },
  {
    label: "Fortnite Picker Wheel",
    href: "/fortnite-picker-wheel",
    description: "Spin random Fortnite skins, challenges, and loadouts.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Pick a random number with an interactive spinner.",
  },
  {
    label: "Name Picker",
    href: "/",
    description: "Add names and let the wheel choose one fairly.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Spin a random color for design or party games.",
  },
  {
    label: "Yes or No Picker Wheel",
    href: "/yes-or-no-wheel",
    description: "Make quick yes/no decisions with a fair spin.",
  },
]

export const POKEMON_WHEEL_CLUSTER_LINKS: PokemonWheelLinkItem[] = [
  {
    label: "Pokémon Picker",
    href: "/pokemon-picker",
    description: "Random Pokémon picker with the curated catalog.",
  },
  {
    label: "Favorite Pokémon Picker",
    href: "/favorite-pokemon-picker-wheel",
    description: "Popular picks for community polls.",
  },
  {
    label: "Pokémon Type Picker Wheel",
    href: "/pokemon-type-picker-wheel",
    description: "Type practice with one icon per type.",
  },
  {
    label: "Starter Pokémon Picker Wheel",
    href: "/starter-pokemon-picker-wheel",
    description: "Starter lines for drafts and Nuzlocke.",
  },
  {
    label: "Legendary Pokémon Picker Wheel",
    href: "/legendary-pokemon-picker-wheel",
    description: "Legendary picks for challenge runs.",
  },
  {
    label: "Mythical Pokémon Picker Wheel",
    href: "/mythical-pokemon-picker-wheel",
    description: "Mythical picks for collectors and themes.",
  },
  {
    label: "Shiny Pokémon Picker Wheel",
    href: "/shiny-pokemon-picker-wheel",
    description: "Shiny-hunt challenge targets.",
  },
  {
    label: "Eeveelution Picker Wheel",
    href: "/eeveelution-picker-wheel",
    description: "Eevee and every Eeveelution.",
  },
  {
    label: "Generation 1 Pokémon Picker Wheel",
    href: "/generation-1-pokemon-picker-wheel",
    description: "Kanto Gen 1 Pokémon only.",
  },
  {
    label: "Generation 9 Pokémon Picker Wheel",
    href: "/generation-9-pokemon-picker-wheel",
    description: "Paldea Gen 9 Pokémon spinner.",
  },
  {
    label: "Random Pokémon Generator",
    href: "/random-pokemon-generator-picker-wheel",
    description: "Full curated catalog generator-style page.",
  },
]

export const POKEMON_WHEEL_ARTICLE_TITLE = "Spin the Pokémon Picker Wheel"

export const POKEMON_WHEEL_ARTICLE_INTRO = [
  "A Pokémon Picker Wheel turns a curated creature catalog into an interactive spinner. Instead of scrolling a list or flipping a coin, you spin so everyone can see a fair random Pokémon land live.",
  "Use generation and type filters when you need a tighter pool—Gen 1 only, Fire types only, starters, legendaries, mythicals, or Eeveelutions. Add favorites, compare entries, eliminate winners across rounds, and save wheels you reuse every challenge run.",
  "Searchers looking for a Pokémon wheel, Pokémon picker, Pokémon spinner, or random Pokémon generator land here for the same job: choose a Pokémon without bias for games, challenges, team ideas, streams, and classroom activities.",
] as const

export const POKEMON_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a Pokémon Picker Wheel?",
    answer:
      "A Pokémon Picker Wheel is a free online spinner that randomly selects a Pokémon from a curated catalog. Load the full set—or filter by generation, type, starters, or legendaries—then spin for challenge runs, drafts, streams, or classroom fun.",
  },
  {
    question: "Can I spin only one generation?",
    answer:
      "Yes. Use the generation filters on this page or open Gen 1–8 template pages to load a single-generation wheel.",
  },
  {
    question: "Can I spin by Pokémon type?",
    answer:
      "Yes. Popular templates include Fire, Water, Grass, Electric, Psychic, and Dragon so you can spin a type-locked challenge pool.",
  },
  {
    question: "Does the wheel include starters and legendaries?",
    answer:
      "Yes. Open the Starter Pokémon or Legendary Pokémon templates—or filter the catalog yourself—when you want those curated sets only.",
  },
  {
    question: "Is this an official Pokémon product?",
    answer:
      "No. This is an independent fan tool for entertainment and education. Names and facts are used for random selection only and are not affiliated with Nintendo, Game Freak, or The Pokémon Company.",
  },
  {
    question: "Can I use it for Nuzlocke or challenge runs?",
    answer:
      "Yes. Many groups spin the Pokémon wheel for random encounter rules, starter drafts, type challenges, and streamer playthrough themes.",
  },
  {
    question: "Can I see details and stats after a spin?",
    answer:
      "Yes. Open details from the list or after a result to view types, generation, region, and starter or legendary flags. The Stats tab summarizes your current pool. You can also heart Pokémon into Favorites and add entries to Comparison for a side-by-side look. These are reference facts for fun and drafts—not live competitive battle data.",
  },
  {
    question: "Does elimination mode work for multi-round picks?",
    answer:
      "Yes. Elimination Mode removes the winning Pokémon after each spin so later rounds choose from the remaining entries—ideal for drafting multiple random picks in one sitting.",
  },
  {
    question: "How fair is the spin?",
    answer:
      "When each Pokémon appears once with equal weight, every entry on the wheel has an equal chance. Remove duplicates in Manage if you need strict equal odds.",
  },
  {
    question: "Can I save my Pokémon wheel?",
    answer:
      "Yes. Use My Wheels to keep generation filters and custom selections on this device for your next challenge night or classroom session.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The Pokémon Picker Wheel is mobile-friendly, so you can spin random Pokémon on phones, tablets, and desktops.",
  },
  {
    question: "Is the Pokémon Picker Wheel free?",
    answer:
      "Yes. You can spin random Pokémon online for free—no signup required for the core spinner.",
  },
  {
    question: "What is a Pokémon Picker Wheel?",
    answer:
      "A Pokémon Picker Wheel is a free online spinner that randomly selects a Pokémon from a curated catalog. Spin for games, challenges, team ideas, quizzes, streams, or fun—and customize by generation, type, starters, legendaries, and more.",
  },
  {
    question: "Can I include every Pokémon?",
    answer:
      "This page uses a curated catalog spanning generations and popular categories—not a live full Pokédex dump. You can still add custom names in the Text tab when your house rules need extra entries.",
  },
  {
    question: "Can I remove Pokémon before spinning?",
    answer:
      "Yes. Deselect or clear entries in Inputs, edit the Text list, or use Manage tools to clear and rebuild the wheel before you spin.",
  },
  {
    question: "Can I use the Pokémon Picker Wheel for team building?",
    answer:
      "Yes. Many players spin for team inspiration or draft seeds, then finish coverage and roles with normal team planning. Pair spins with elimination mode when each pick should be unique.",
  },
  {
    question: "Do you have mythical, shiny, and Eeveelution wheels?",
    answer:
      "Yes. Open the Mythical Pokémon Picker Wheel, Shiny Pokémon Picker Wheel (popular hunt targets), and Eeveelution Wheel from Popular templates or the Pokémon topic cluster links on this page.",
  },
] as const
