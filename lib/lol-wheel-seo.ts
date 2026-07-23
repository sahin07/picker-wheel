import { HOME_SITE_URL } from "@/lib/home-seo"

export const LOL_WHEEL_SITE_URL = HOME_SITE_URL
export const LOL_WHEEL_PATH = "/lol-picker-wheel"
export const LOL_WHEEL_URL = `${LOL_WHEEL_SITE_URL}${LOL_WHEEL_PATH}`
export const LOL_WHEEL_OG_IMAGE_URL = `${LOL_WHEEL_SITE_URL}/og/lol-picker-wheel.svg`

export const LOL_WHEEL_PAGE_TITLE =
  "LoL Picker Wheel | Random League of Legends Champion Picker"

export const LOL_WHEEL_PAGE_DESCRIPTION =
  "Spin the LoL Picker Wheel to pick a random League of Legends champion for ranked, ARAM vibes, challenges, or fun. Filter by role, playstyle, difficulty, or S-tier favorites."

export const LOL_WHEEL_H1 = "LoL Picker Wheel"

export const LOL_WHEEL_SHORT_TITLE = "LoL Picker Wheel"

export const LOL_WHEEL_HERO_INTRO =
  "Can't decide which champion to play? Spin the LoL Picker Wheel and randomly select a League of Legends champion in seconds. Filter by lane, playstyle, difficulty, or meta favorites—perfect for ranked queues, challenge runs, streams, and party drafts."

export const LOL_WHEEL_KEYWORDS = [
  "lol wheel",
  "lol champion wheel",
  "league of legends wheel",
  "random lol champion",
  "lol champion picker",
  "league champion spinner",
  "random league champion",
  "lol randomizer",
  "adc wheel",
  "support wheel",
  "jungle wheel",
  "mid lane wheel",
] as const

export const LOL_WHEEL_ON_THIS_PAGE = [
  { id: "lol-popular", label: "Popular LoL templates" },
  { id: "lol-spin-wheel", label: "Spin the LoL Picker Wheel" },
  { id: "lol-whats-on", label: "What you can put on the wheel" },
  { id: "lol-features", label: "Features on this page" },
  { id: "lol-create", label: "Create your own LoL Picker Wheel" },
  { id: "lol-how-it-works", label: "How the LoL Picker Wheel works" },
  { id: "lol-options", label: "How this tool's options work" },
  { id: "lol-use-cases", label: "Common ways to use a LoL Picker Wheel" },
  { id: "lol-why", label: "Why use a LoL Picker Wheel" },
  { id: "lol-comparison", label: "LoL Picker Wheel vs random champion generator" },
  { id: "lol-tips", label: "Fairness tips & best practices" },
  { id: "lol-customize", label: "How to customize your wheel" },
  { id: "lol-related", label: "Related tools" },
  { id: "lol-cluster", label: "LoL topic cluster" },
  { id: "lol-faq", label: "FAQ" },
] as const

export type LolWheelLinkItem = {
  label: string
  href: string
  description: string
}

export const LOL_WHEEL_POPULAR_TEMPLATES: LolWheelLinkItem[] = [
  {
    label: "Random LoL Champion",
    href: "/random-lol-champion-picker-wheel",
    description: "Full curated champion set on one fair spinner.",
  },
  {
    label: "Top Lane Picker Wheel",
    href: "/lol-top-lane-picker-wheel",
    description: "Top laners only for solo-lane challenges.",
  },
  {
    label: "Jungle Picker Wheel",
    href: "/lol-jungle-picker-wheel",
    description: "Junglers for pathing and gank challenges.",
  },
  {
    label: "Mid Lane Picker Wheel",
    href: "/lol-mid-picker-wheel",
    description: "Mid laners for roam and skirmish nights.",
  },
  {
    label: "ADC Picker Wheel",
    href: "/lol-adc-picker-wheel",
    description: "Bot-lane marksmen for duo queue fun.",
  },
  {
    label: "Support Picker Wheel",
    href: "/lol-support-picker-wheel",
    description: "Supports for vision and peel challenges.",
  },
  {
    label: "Assassin Picker Wheel",
    href: "/lol-assassin-picker-wheel",
    description: "Assassin playstyle champions only.",
  },
  {
    label: "Beginner Champions",
    href: "/lol-beginner-champion-picker-wheel",
    description: "Easy-difficulty champions for new players.",
  },
  {
    label: "S-Tier Champions",
    href: "/lol-s-tier-champion-picker-wheel",
    description: "S-tier curated picks for meta vibes.",
  },
  {
    label: "Favorite Champions",
    href: "/lol-favorite-champions-picker-wheel",
    description: "Community-favorite champions for polls.",
  },
  {
    label: "Demacia Picker Wheel",
    href: "/lol-demacia-picker-wheel",
    description: "Demacian champions for lore-themed challenges.",
  },
  {
    label: "Noxus Picker Wheel",
    href: "/lol-noxus-picker-wheel",
    description: "Noxian champions for conquest-themed nights.",
  },
  {
    label: "Ionia Picker Wheel",
    href: "/lol-ionia-picker-wheel",
    description: "Ionian champions for spirit-realm themed spins.",
  },
  {
    label: "A-Tier Champions",
    href: "/lol-a-tier-champion-picker-wheel",
    description: "A-tier curated picks for strong shortlists.",
  },
]

export const LOL_WHEEL_CREATE_POINTS = [
  {
    title: "Load the curated roster",
    description:
      "Start with popular champions across all five roles, then spin for a fair random pick.",
  },
  {
    title: "Filter by role",
    description:
      "Lock the wheel to Top, Jungle, Mid, ADC, or Support when your queue needs a lane.",
  },
  {
    title: "Filter by playstyle",
    description:
      "Open assassin, mage, marksman, tank, or fighter templates for tighter challenge pools.",
  },
  {
    title: "Remove champions",
    description:
      "Deselect champs you refuse to play, or use Elimination Mode to remove winners after each spin.",
  },
  {
    title: "Add custom names",
    description:
      "Use Manual mode to add house-rule champions or challenge prompts to the wheel.",
  },
  {
    title: "Save your wheel",
    description:
      "Keep custom LoL wheels in My Wheels on this device for the next ranked night or stream.",
  },
] as const

export const LOL_WHEEL_WHATS_ON_WHEEL = [
  "A curated League of Legends champion set with role, difficulty, tier, region, and playstyle metadata",
  "Role filters — Top, Jungle, Mid, ADC, Support, or every champion on one spinner",
  "Playstyle templates — Assassin, Mage, Marksman, Tank, Fighter",
  "Region templates — Demacia, Noxus, Ionia, Shadow Isles, Piltover",
  "Beginner, hard, S-tier, A-tier, and community-favorite templates",
  "Custom text entries — add house-rule names in Manual mode",
] as const

export const LOL_WHEEL_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive LoL Picker Wheel sits above this guide. Load champions and spin without leaving the page.",
  },
  {
    title: "Role and playstyle filters",
    description:
      "Rebuild the wheel from Inputs with a lane, playstyle template, or beginner / S-tier shortlist.",
  },
  {
    title: "Elimination & Results history",
    description:
      "Remove winners across multi-round drafts; review recent spins from Results.",
  },
  {
    title: "Display, sound & fullscreen",
    description:
      "Emoji & name, emoji only, or name only—plus confetti, mute-friendly spins, and stream-friendly layout.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips open achievements, spin trends, Social sharing, and bingo-style challenge modes.",
  },
  {
    title: "My Wheels on this device",
    description:
      "Save role filters and custom lists locally for the next ranked night or classroom session.",
  },
] as const

export const LOL_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your pool",
    description:
      "Start with all champions, filter to a role, or open a playstyle / beginner / S-tier template.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Deselect champions, enable elimination, set display mode, and tune Style options.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click Spin so everyone sees a fair random League champion land live.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Lock in for ranked, assign a challenge pick, remove the winner, and spin again for the next round.",
  },
] as const

export const LOL_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Pick a template or role",
    description:
      "Tap a Popular LoL template, or set role filters in the Champions tab.",
  },
  {
    step: 2,
    title: "Tune entries and mode",
    description:
      "Remove champions you skip, enable elimination, and set emoji display for streams.",
  },
  {
    step: 3,
    title: "Spin and review",
    description:
      "Spin once, check Results history, and remove winners for multi-pick drafts.",
  },
  {
    step: 4,
    title: "Save for next queue",
    description:
      "Keep your wheel in My Wheels so the same role pool opens instantly.",
  },
] as const

export const LOL_WHEEL_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Interactive spinning everyone can watch live",
    generator: "Instant random champion with one click",
  },
  {
    aspect: "Streams & groups",
    wheel: "Great for duo queue, party drafts, and classrooms",
    generator: "Better for quick solo picks",
  },
  {
    aspect: "Customization",
    wheel: "Roles, playstyles, tiers, and elimination built in",
    generator: "Usually a fixed champion list",
  },
  {
    aspect: "Engagement",
    wheel: "More engaging—a shared moment around the spin",
    generator: "Simpler interface, less visual buildup",
  },
] as const

export const LOL_WHEEL_EEAT_TIPS = [
  {
    id: "lol-eeat-challenges",
    title: "Challenge queues",
    body: "Players use a LoL Picker Wheel for self-imposed challenges—mono-role nights, assassin-only weeks, or beginner-champion warmups. Spin once, commit, and queue.",
  },
  {
    id: "lol-eeat-roles",
    title: "Role fairness",
    body: "When the lobby argues over lanes, spin a role-locked wheel so Top, Jungle, Mid, ADC, or Support picks stay transparent.",
  },
  {
    id: "lol-eeat-filters",
    title: "Filters before you spin",
    body: "Deselect champions you refuse, open a playstyle template when the challenge is class-locked, or switch to Elimination so each round removes the winner from the pool.",
  },
  {
    id: "lol-eeat-randomness",
    title: "How randomness works",
    body: "Each enabled champion on the wheel has an equal chance when it appears once. Remove duplicates or use Elimination for multi-round fairness.",
  },
  {
    id: "lol-eeat-streams",
    title: "Streams & groups",
    body: "Mute, fullscreen, and emoji display modes keep spins readable on stream. Results history helps recap multi-round drafts for chat.",
  },
  {
    id: "lol-eeat-disclaimer",
    title: "Fan tool disclaimer",
    body: "This is an independent fan tool for entertainment—not affiliated with Riot Games, League of Legends, or related trademarks. Champion facts are reference trivia for random selection, not live ranked stats.",
  },
] as const

export const LOL_WHEEL_USE_CASES = [
  {
    category: "Ranked & normals",
    items: [
      "Random champion when you fill a role",
      "Lane-locked challenge queues",
      "Beginner-friendly warmups before ranked",
    ],
  },
  {
    category: "Party & drafts",
    items: [
      "Duo/bot lane ADC or Support spins",
      "Multi-round elimination drafts",
      "Playstyle-themed party nights",
    ],
  },
  {
    category: "Content creation",
    items: [
      "Twitch “chat picks my champ” segments",
      "YouTube challenge series seeds",
      "Community favorite polls",
    ],
  },
  {
    category: "Learning & fun",
    items: [
      "Try a new playstyle each night",
      "Easy-champion teaching sessions",
      "Classroom esports icebreakers",
    ],
  },
] as const

export const LOL_WHEEL_WHY_POINTS = [
  {
    title: "Fair random selection",
    description:
      "Every enabled champion gets an equal spin chance—no lobby host bias.",
  },
  {
    title: "Great for challenge runs",
    description:
      "Spin roles, playstyles, beginners, or S-tier shortlists for self-imposed rules.",
  },
  {
    title: "Lane-ready filters",
    description:
      "Jump into Top, Jungle, Mid, ADC, or Support without rebuilding the list.",
  },
  {
    title: "Easy to customize",
    description:
      "Remove champions, add custom names, change display mode, and save wheels.",
  },
  {
    title: "Mobile friendly",
    description:
      "Spin on phones, tablets, or a living-room TV browser—no app install.",
  },
  {
    title: "Free to use",
    description:
      "The LoL Picker Wheel is free for ranked nights, streams, and casual fun.",
  },
] as const

export const LOL_WHEEL_RELATED_TOOLS: LolWheelLinkItem[] = [
  {
    label: "Fortnite Picker Wheel",
    href: "/fortnite-picker-wheel",
    description: "Spin random Fortnite skins, challenges, and loadouts.",
  },
  {
    label: "Pokémon Picker Wheel",
    href: "/pokemon-picker-wheel",
    description: "Spin a random Pokémon for challenges and drafts.",
  },
  {
    label: "NBA Picker Wheel",
    href: "/nba-team-picker-wheel",
    description: "Spin random NBA teams for drafts and watch parties.",
  },
  {
    label: "Yes or No Picker Wheel",
    href: "/yes-or-no-wheel",
    description: "Make quick queue decisions with a yes/no spin.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split names into fair random teams.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Spin a number for giveaways, seats, or challenge ranks.",
  },
  {
    label: "Name Picker Wheel",
    href: "/random-name-picker",
    description: "Spin names for lobbies, classrooms, and party games.",
  },
]

export const LOL_WHEEL_CLUSTER_LINKS: LolWheelLinkItem[] = [
  {
    label: "Random LoL Champion",
    href: "/random-lol-champion-picker-wheel",
    description: "Full curated champion catalog.",
  },
  {
    label: "Top Lane Picker Wheel",
    href: "/lol-top-lane-picker-wheel",
    description: "Top laners only.",
  },
  {
    label: "Jungle Picker Wheel",
    href: "/lol-jungle-picker-wheel",
    description: "Junglers only.",
  },
  {
    label: "Mid Lane Picker Wheel",
    href: "/lol-mid-picker-wheel",
    description: "Mid laners only.",
  },
  {
    label: "ADC Picker Wheel",
    href: "/lol-adc-picker-wheel",
    description: "ADC champions only.",
  },
  {
    label: "Support Picker Wheel",
    href: "/lol-support-picker-wheel",
    description: "Supports only.",
  },
  {
    label: "Assassin Picker Wheel",
    href: "/lol-assassin-picker-wheel",
    description: "Assassin playstyle.",
  },
  {
    label: "Beginner Champions",
    href: "/lol-beginner-champion-picker-wheel",
    description: "Easy difficulty.",
  },
  {
    label: "S-Tier Champions",
    href: "/lol-s-tier-champion-picker-wheel",
    description: "S-tier curated set.",
  },
  {
    label: "Favorite Champions",
    href: "/lol-favorite-champions-picker-wheel",
    description: "Community favorites.",
  },
  {
    label: "Demacia Picker Wheel",
    href: "/lol-demacia-picker-wheel",
    description: "Demacia region only.",
  },
  {
    label: "Noxus Picker Wheel",
    href: "/lol-noxus-picker-wheel",
    description: "Noxus region only.",
  },
  {
    label: "Ionia Picker Wheel",
    href: "/lol-ionia-picker-wheel",
    description: "Ionia region only.",
  },
  {
    label: "Shadow Isles Picker Wheel",
    href: "/lol-shadow-isles-picker-wheel",
    description: "Shadow Isles region only.",
  },
  {
    label: "Piltover Picker Wheel",
    href: "/lol-piltover-picker-wheel",
    description: "Piltover region only.",
  },
  {
    label: "A-Tier Champions",
    href: "/lol-a-tier-champion-picker-wheel",
    description: "A-tier curated set.",
  },
  {
    label: "Hard Champions",
    href: "/lol-hard-champion-picker-wheel",
    description: "Hard & expert difficulty.",
  },
]

export const LOL_WHEEL_ARTICLE_TITLE = "Spin the LoL Picker Wheel"

export const LOL_WHEEL_ARTICLE_INTRO = [
  "A LoL Picker Wheel turns a curated League of Legends champion list into an interactive spinner. Instead of scrolling the client or flipping a coin, you spin so everyone can see a fair random champion land live.",
  "Use role and playstyle filters when you need a tighter pool—ADC only, assassins only, beginners only, or S-tier favorites. Remove champions, enable elimination across rounds, and save wheels you reuse every ranked night.",
  "Searchers looking for a LoL wheel, League champion picker, or random LoL champion generator land here for the same job: choose a champion without bias for games, challenges, streams, and fun.",
] as const

export const LOL_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Role filters",
    description:
      "Choose All Champions or Top / Jungle / Mid / ADC / Support to rebuild the wheel from that lane’s curated set.",
  },
  {
    title: "Playstyle & specialty templates",
    description:
      "Open Assassin, Mage, Marksman, Tank, Fighter, Beginner, Hard, S-tier, A-tier, Favorites, or region templates (Demacia, Noxus, Ionia, Shadow Isles, Piltover) when the challenge is class-, skill-, or lore-locked.",
  },
  {
    title: "Display Options",
    description:
      "Emoji & Name, Emoji Only, or Name Only controls how each slice appears while you spin and when a winner lands.",
  },
  {
    title: "Champion details after a spin",
    description:
      "The result card shows role, difficulty, and playstyle so you can commit with context—reference trivia for challenges, not live ranked stats.",
  },
  {
    title: "Stats",
    description:
      "The Stats tab summarizes your current wheel—role counts and spin history—so you can sanity-check a pool before a multi-round draft.",
  },
  {
    title: "Manual vs AI-Powered",
    description:
      "Manual lets you select champions yourself. AI-Powered can suggest role themes or shortlists from the current filter.",
  },
  {
    title: "Action Mode & Game Mode",
    description:
      "Normal Mode keeps every champion after a spin. Elimination Mode removes the winner. Manual Mode lets you type custom names. Header Games opens advanced challenge modes.",
  },
  {
    title: "Text, Style & Other",
    description:
      "Text tab bulk-edits the entry list. Style sets display mode and themes. Other Options toggles confetti and spin sound, spinning duration/speed, plus import/export and fullscreen.",
  },
  {
    title: "Shuffle, Sort & Manage",
    description:
      "Shuffle randomizes slice order. Manage covers Sort A–Z / Z–A, remove duplicates, clear all, and Remove winner (synced with Elimination).",
  },
  {
    title: "Results & Spin History",
    description:
      "Results (top-left of the wheel column) opens recent winners with emoji and name. Spin History in the sidebar shows past spins with a badge count.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips under the wheel open Achievements, Analytics, Social sharing, and bingo-style challenge modes.",
  },
  {
    title: "Wheel controls",
    description:
      "Mute toggles whoosh and win sounds. Fullscreen expands the spinner. STOP ends a spin early and locks in the champion at the pointer. Click the wheel or Spin to start.",
  },
] as const

export const LOL_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a LoL Picker Wheel?",
    answer:
      "A LoL Picker Wheel is a free online spinner that randomly selects a League of Legends champion from a curated catalog. Filter by role, playstyle, difficulty, or favorites, then spin for ranked, challenges, streams, or fun.",
  },
  {
    question: "Can I spin only one role?",
    answer:
      "Yes. Use role filters on this page or open Top, Jungle, Mid, ADC, and Support template pages.",
  },
  {
    question: "Can I filter by playstyle?",
    answer:
      "Yes. Templates include Assassin, Mage, Marksman, Tank, and Fighter so you can spin a playstyle-locked pool.",
  },
  {
    question: "What is the difference between role and playstyle filters?",
    answer:
      "Role filters lock the wheel to a lane (Top, Jungle, Mid, ADC, Support). Playstyle templates group champions by class fantasy—assassin, mage, marksman, tank, or fighter—across lanes.",
  },
  {
    question: "Do you have beginner, S-tier, and favorites wheels?",
    answer:
      "Yes. Open Beginner Champions, S-Tier Champions, and Favorite Champions from Popular templates or the LoL topic cluster on this page. A-Tier and Hard Champions templates are also available for strong or skill-gated shortlists.",
  },
  {
    question: "Can I spin by Runeterra region?",
    answer:
      "Yes. Region templates include Demacia, Noxus, Ionia, Shadow Isles, and Piltover—each loads only champions from that lore region.",
  },
  {
    question: "Can I see role, difficulty, and playstyle after a spin?",
    answer:
      "Yes. The result card shows the champion’s role, difficulty, and playstyle as reference trivia for challenges and drafts—not live competitive balance data.",
  },
  {
    question: "Can I use the LoL Picker Wheel for ranked, challenges, or streams?",
    answer:
      "Yes. Players spin for fill queues, mono-role challenges, streamer segments, duo drafts, and teaching warmups. Elimination Mode helps when each pick should be unique.",
  },
  {
    question: "Can I remove champions before spinning?",
    answer:
      "Yes. Deselect entries in Inputs, clear the list, or use Manage tools to rebuild the wheel before you spin.",
  },
  {
    question: "Does elimination mode work for multi-round picks?",
    answer:
      "Yes. Elimination Mode removes the winning champion after each spin so later rounds choose from the remaining entries.",
  },
  {
    question: "How fair is the spin?",
    answer:
      "When each champion appears once with equal weight, every entry on the wheel has an equal chance.",
  },
  {
    question: "Can I save my LoL Picker Wheel?",
    answer:
      "Yes. Use My Wheels to keep role filters and custom selections on this device.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The LoL Picker Wheel is mobile-friendly on phones, tablets, and desktops.",
  },
  {
    question: "Is the LoL Picker Wheel free?",
    answer:
      "Yes. You can spin random League champions online for free—no signup required for the core spinner.",
  },
  {
    question: "Is this an official Riot Games product?",
    answer:
      "No. This is an independent fan tool for entertainment. Names and facts are used for random selection only and are not affiliated with Riot Games.",
  },
  {
    question: "Can I include every champion in League?",
    answer:
      "This page uses a curated popular-champion set by role—not a live full client dump. Add custom names in Manual mode when your house rules need extra entries.",
  },
  {
    question: "Can I use AI to build a champion shortlist?",
    answer:
      "Yes. Open the AI tab under Inputs to ask for role themes or balanced shortlists from the current filter, then spin the resulting set.",
  },
] as const
