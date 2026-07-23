import { HOME_SITE_URL } from "@/lib/home-seo"

export const NBA_WHEEL_SITE_URL = HOME_SITE_URL

/** Canonical pillar path */
export const NBA_WHEEL_PATH = "/nba-team-picker-wheel"

export const NBA_WHEEL_URL = `${NBA_WHEEL_SITE_URL}${NBA_WHEEL_PATH}`

export const NBA_WHEEL_OG_IMAGE_URL = `${NBA_WHEEL_SITE_URL}/og/nba-picker-wheel.svg`

export const NBA_WHEEL_PAGE_TITLE =
  "NBA Picker Wheel | Random NBA Team Spinner Online Free"

export const NBA_WHEEL_PAGE_DESCRIPTION =
  "Spin a free NBA Picker Wheel to pick a random NBA team. Filter by Eastern or Western Conference, spin by division, compare franchises, and use it for fantasy drafts, watch parties, and basketball games."

export const NBA_WHEEL_H1 = "NBA Picker Wheel"

export const NBA_WHEEL_SHORT_TITLE = "NBA Picker Wheel"

export const NBA_WHEEL_HERO_INTRO =
  "Need a random NBA team fast? Our NBA Picker Wheel spins all 30 National Basketball Association franchises so you can draft a fantasy club, pick a watch-party side, or choose a video-game team without arguing. Filter by Eastern or Western Conference, load a division, customize the wheel, and spin."

export const NBA_WHEEL_KEYWORDS = [
  "nba picker wheel",
  "nba team wheel",
  "random nba team",
  "nba team spinner",
  "nba random team generator",
  "eastern conference wheel",
  "western conference wheel",
  "nba fantasy draft wheel",
  "basketball team picker",
  "spin the nba wheel",
  "nba team randomizer",
  "random basketball team",
] as const

export const NBA_WHEEL_ON_THIS_PAGE = [
  { id: "nba-popular", label: "Popular NBA templates" },
  { id: "nba-spin-wheel", label: "Spin the NBA Picker Wheel" },
  { id: "nba-whats-on", label: "What you can put on the wheel" },
  { id: "nba-features", label: "Features on this page" },
  { id: "nba-create", label: "Build your NBA team wheel" },
  { id: "nba-how-it-works", label: "How the NBA wheel works" },
  { id: "nba-options", label: "How this tool's options work" },
  { id: "nba-use-cases", label: "Ways to use an NBA wheel" },
  { id: "nba-why", label: "Why use an NBA Picker Wheel" },
  { id: "nba-comparison", label: "Picker wheel vs random team generator" },
  { id: "nba-tips", label: "Fairness tips & best practices" },
  { id: "nba-customize", label: "How to customize your wheel" },
  { id: "nba-related", label: "Related tools" },
  { id: "nba-cluster", label: "NBA topic cluster" },
  { id: "nba-faq", label: "FAQ" },
] as const

export type NbaWheelLinkItem = {
  label: string
  href: string
  description: string
}

/** Popular templates — dedicated spoke URLs. */
export const NBA_WHEEL_POPULAR_TEMPLATES: NbaWheelLinkItem[] = [
  {
    label: "Random NBA Team",
    href: "/random-nba-team-picker-wheel",
    description: "Spin all 30 NBA franchises for a fair random pick.",
  },
  {
    label: "Eastern Conference",
    href: "/nba-eastern-conference-picker-wheel",
    description: "East-only spinner for fantasy drafts and East watch parties.",
  },
  {
    label: "Western Conference",
    href: "/nba-western-conference-picker-wheel",
    description: "West-only wheel for Western Conference matchups and drafts.",
  },
  {
    label: "Atlantic Division",
    href: "/nba-atlantic-picker-wheel",
    description: "Celtics, Nets, Knicks, 76ers, and Raptors.",
  },
  {
    label: "Central Division",
    href: "/nba-central-picker-wheel",
    description: "Bulls, Cavaliers, Pistons, Pacers, and Bucks.",
  },
  {
    label: "Southeast Division",
    href: "/nba-southeast-picker-wheel",
    description: "Hawks, Hornets, Heat, Magic, and Wizards.",
  },
  {
    label: "Northwest Division",
    href: "/nba-northwest-picker-wheel",
    description: "Nuggets, Timberwolves, Thunder, Trail Blazers, and Jazz.",
  },
  {
    label: "Pacific Division",
    href: "/nba-pacific-picker-wheel",
    description: "Warriors, Clippers, Lakers, Suns, and Kings.",
  },
  {
    label: "Southwest Division",
    href: "/nba-southwest-picker-wheel",
    description: "Mavericks, Rockets, Grizzlies, Pelicans, and Spurs.",
  },
  {
    label: "NBA Champions",
    href: "/nba-championship-winners-picker-wheel",
    description: "Spin franchises that have won at least one NBA title.",
  },
]

export const NBA_WHEEL_CREATE_POINTS = [
  {
    title: "Load all 30 teams",
    description:
      "Start with every NBA franchise on the wheel, then spin for a fully random basketball pick.",
  },
  {
    title: "Filter by conference",
    description:
      "Switch to Eastern Conference or Western Conference when you only want one side on the spinner.",
  },
  {
    title: "Narrow by division",
    description:
      "Open a division template (Atlantic, Pacific, and more) for tighter rivalry and fantasy pools.",
  },
  {
    title: "Change display mode",
    description:
      "Show team names, logos, or both so results are easy to read on a TV or phone.",
  },
  {
    title: "Compare & favorite",
    description:
      "Heart teams into Favorites, add clubs to Comparison, and open Team Details for identity, venue, colors, leadership, and franchise stats.",
  },
  {
    title: "Save your wheel",
    description:
      "Keep custom NBA wheels in My Wheels on this device for the next draft night or watch party.",
  },
] as const

export const NBA_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Conference filters",
    description:
      "Choose All Conferences, Eastern Conference, or Western Conference to rebuild the wheel with matching franchises.",
  },
  {
    title: "Display Options",
    description:
      "Logo & Name, Logo Only, or Name Only controls how each slice appears while you spin and when a winner lands.",
  },
  {
    title: "Add to Favorites",
    description:
      "Tap the heart on any team in the Inputs list to star it. Open Favorites from the sidebar header to revisit clubs you care about for drafts or watch parties.",
  },
  {
    title: "Team Comparison",
    description:
      "Add up to four teams to Comparison from the list or the compare icon in the sidebar header. The Comparison modal shows logos, conferences, divisions, and championship history side by side before you spin.",
  },
  {
    title: "Team Details",
    description:
      "Open Team Details from the list or after a spin to see franchise identity: conference and division badges, NBA titles, Century Club age, city, home venue, team colors, coach, owner, and historical context (founded year). Example fields match what you see for clubs like the Boston Celtics (BOS)—TD Garden, primary/secondary colors, leadership, and title counts.",
  },
  {
    title: "Team Statistics",
    description:
      "Team Statistics summarize franchise facts—NBA championships, years in the league, conference, division, home venue, and founding year. This is franchise-level info for trivia and drafts, not live box scores.",
  },
  {
    title: "Manual vs AI-Powered",
    description:
      "Manual lets you select teams yourself. AI-Powered can suggest balanced sets, trivia prompts, or draft-style shortlists from the current conference filter.",
  },
  {
    title: "Action Mode & Game Mode",
    description:
      "Normal Mode keeps every team after a spin. Elimination Mode removes the winner for multi-round drafts. Manual Mode lets you type a team under the wheel. Game Mode on the wheel mirrors the same setting.",
  },
  {
    title: "Text, Style & Sound",
    description:
      "Text tab bulk-edits the team list. Style sets display mode and color palettes. Other Options toggles confetti and spin sound, plus import/export and fullscreen.",
  },
  {
    title: "Shuffle, Sort & Manage",
    description:
      "Shuffle randomizes slice order. Manage menu covers Sort Z–A, remove duplicates, clear all, and Remove winner (synced with Elimination).",
  },
  {
    title: "Results & Spin History",
    description:
      "Results (top-left of the wheel column) opens the last five winners with logo and name. Spin History in the sidebar header shows past spins with a badge count.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips under the wheel open Achievements (points and theme unlocks), Analytics (spin trends and breakdowns), Social (profile and sharing), and Games (bingo and challenge modes).",
  },
  {
    title: "Wheel controls",
    description:
      "Mute toggles whoosh and win sounds. Fullscreen expands the spinner. STOP ends a spin early and locks in the team at the pointer. Click the wheel or Spin to start.",
  },
] as const

export const NBA_WHEEL_WHATS_ON_WHEEL = [
  "All 30 NBA franchises with logos, conference, and division metadata",
  "Conference filters — Eastern, Western, or every team on one spinner",
  "Division templates — Atlantic, Central, Southeast, Northwest, Pacific, and Southwest",
  "NBA champions template — franchises with at least one title",
  "Favorites and comparison — shortlist up to four teams before you spin",
  "Custom text entries — add fantasy pool names or house rules in the Text tab",
] as const

export const NBA_WHEEL_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive wheel sits above this guide. All 30 teams load by default—spin without leaving the page.",
  },
  {
    title: "Conference and division filters",
    description:
      "Rebuild the wheel from the Inputs sidebar with Eastern, Western, or a single five-team division.",
  },
  {
    title: "Team Details, stats & comparison",
    description:
      "Open franchise identity, championships, venue, colors, coach, and owner—plus side-by-side comparison.",
  },
  {
    title: "Elimination & Results history",
    description:
      "Remove winners across multi-round fantasy drafts; review recent spins from Results or Spin History.",
  },
  {
    title: "Display, sound & fullscreen",
    description:
      "Logo & name, logo only, or name only—plus confetti, mute, STOP, and fullscreen for watch parties.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips open achievements, spin trends, Social sharing, and bingo-style challenge modes.",
  },
  {
    title: "My Wheels on this device",
    description:
      "Save conference filters and custom team lists locally for the next draft night or classroom session.",
  },
] as const

export const NBA_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your pool",
    description:
      "Start with all 30 teams, filter to a conference, open a division template, or load NBA champions only.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Set logo display, favorite franchises, enable elimination mode, and tune colors from Style.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click Spin or tap the wheel so everyone sees a fair random NBA team land live.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Open Team Details, assign a rooting interest, remove the winner, and spin again for the next round.",
  },
] as const

export const NBA_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Pick a template or filter",
    description:
      "Tap a Popular NBA template under Build Your Wheel, or set Eastern, Western, or division filters in Inputs.",
  },
  {
    step: 2,
    title: "Tune teams and style",
    description:
      "Remove teams you do not need, enable elimination, set display mode, and use fullscreen for the room.",
  },
  {
    step: 3,
    title: "Spin and review",
    description:
      "Spin once, check Results history, compare franchises, and remove winners for multi-pick drafts.",
  },
  {
    step: 4,
    title: "Save for next season",
    description:
      "Keep your wheel in My Wheels on this device so the same conference or division pool opens instantly.",
  },
] as const

export const NBA_WHEEL_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Interactive spinning everyone can watch live",
    generator: "Instant random team with one click",
  },
  {
    aspect: "Streams & groups",
    wheel: "Great for watch parties, drafts, and classrooms",
    generator: "Fast for solo picks when you only need a quick team",
  },
  {
    aspect: "Filters",
    wheel: "Eastern, Western, division, and champions templates built in",
    generator: "Usually a flat list with little filtering",
  },
  {
    aspect: "Engagement",
    wheel: "More engaging—a shared moment around the spin",
    generator: "Simpler interface, less visual buildup",
  },
] as const

export const NBA_WHEEL_EEAT_TIPS = [
  {
    id: "nba-eeat-randomness",
    title: "How randomness works",
    body: "Each enabled NBA team on the wheel has an equal chance when it appears once. Duplicate entries or multiple slices for the same franchise increase odds—use Remove duplicates in Manage for strict fairness.",
  },
  {
    id: "nba-eeat-fairness",
    title: "Best practices for fair picks",
    body: "Before a fantasy draft or classroom spin, confirm everyone sees the same team list. Announce results while the wheel is visible, and use elimination when each franchise should win only once.",
  },
  {
    id: "nba-eeat-disclaimer",
    title: "Fan tool disclaimer",
    body: "This is an independent fan tool for entertainment and education—not affiliated with the NBA or its clubs. Franchise facts are reference trivia, not live scores or official league data.",
  },
] as const

export const NBA_WHEEL_USE_CASES = [
  {
    category: "Fantasy & drafts",
    items: [
      "Fantasy basketball draft icebreakers",
      "Keeper league random team draws",
      "Salary-cap draft order fun spins",
    ],
  },
  {
    category: "Watch parties",
    items: [
      "Pick a team to root for tonight",
      "East vs West watch-party sides",
      "Finals bracket party games",
    ],
  },
  {
    category: "Games & streaming",
    items: [
      "NBA 2K franchise picks",
      "Streamer challenge random teams",
      "Bar trivia basketball rounds",
    ],
  },
  {
    category: "Classroom & camps",
    items: [
      "PE basketball unit team picks",
      "Summer camp NBA trivia spins",
      "Geography lessons by NBA cities",
    ],
  },
] as const

export const NBA_WHEEL_WHY_POINTS = [
  {
    title: "Fair random picks",
    description:
      "Every enabled franchise gets an equal spin chance—no host bias when friends argue over teams.",
  },
  {
    title: "Conference-ready filters",
    description:
      "Jump straight into Eastern, Western, or a division instead of rebuilding the list every time.",
  },
  {
    title: "Works on any device",
    description:
      "Spin on phones, tablets, or a living-room TV browser—no app install required.",
  },
  {
    title: "Free to use",
    description:
      "The NBA Picker Wheel is free for fantasy nights, classrooms, and casual basketball fun.",
  },
] as const

export const NBA_WHEEL_RELATED_TOOLS: NbaWheelLinkItem[] = [
  {
    label: "MLB Team Picker",
    href: "/mlb-picker-wheel",
    description: "Spin a random MLB franchise for baseball drafts and games.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split custom names into fair teams for sports and classrooms.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Make quick basketball-night decisions with a yes/no spin.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin custom names, prizes, or lineup ideas.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Pick random numbers for draft slots or quarter challenges.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable spinner for any basketball list.",
  },
]

export const NBA_WHEEL_CLUSTER_LINKS: NbaWheelLinkItem[] = [
  {
    label: "Random NBA Team",
    href: "/random-nba-team-picker-wheel",
    description: "All 30 franchises on one spinner.",
  },
  {
    label: "Eastern Conference Wheel",
    href: "/nba-eastern-conference-picker-wheel",
    description: "East-only random team picks.",
  },
  {
    label: "Western Conference Wheel",
    href: "/nba-western-conference-picker-wheel",
    description: "West-only random team picks.",
  },
  {
    label: "Atlantic Division Spinner",
    href: "/nba-atlantic-picker-wheel",
    description: "Five-team Atlantic rivalry wheel.",
  },
  {
    label: "Pacific Division Spinner",
    href: "/nba-pacific-picker-wheel",
    description: "Five-team Pacific rivalry wheel.",
  },
  {
    label: "NBA Champions",
    href: "/nba-championship-winners-picker-wheel",
    description: "Franchises with at least one title.",
  },
  {
    label: "MLB Random Team",
    href: "/mlb-picker-wheel",
    description: "Sister sports wheel for baseball.",
  },
  {
    label: "Custom Team Generator",
    href: "/team-picker-wheel",
    description: "Build teams from your own name list.",
  },
]

export const NBA_WHEEL_ARTICLE_TITLE = "Spin the NBA Picker Wheel"

export const NBA_WHEEL_ARTICLE_INTRO = [
  "An NBA Picker Wheel turns National Basketball Association franchises into an interactive spinner. Instead of scrolling a list or flipping a coin, you spin a basketball team wheel so everyone can see a fair random NBA team land live.",
  "Use conference and division filters when you need a tighter pool—Eastern Conference only, Western Conference only, or a single division like Atlantic. Add favorites, compare clubs, open Team Details for venue and championship facts, eliminate winners across rounds, and save wheels you reuse every fantasy season.",
  "Searchers looking for an NBA team wheel, random NBA team generator, or basketball team spinner land here for the same job: pick an NBA franchise without bias for drafts, watch parties, video games, and classroom activities.",
] as const

export const NBA_WHEEL_FAQ_ITEMS = [
  {
    question: "What is an NBA Picker Wheel?",
    answer:
      "An NBA Picker Wheel is a free online spinner that randomly selects a National Basketball Association team. Load all 30 franchises—or filter by conference and division—then spin to pick a team for fantasy drafts, watch parties, or games.",
  },
  {
    question: "Can I spin only Eastern or Western Conference teams?",
    answer:
      "Yes. Use the conference filters on this page or open the Eastern Conference and Western Conference template pages to load East-only or West-only wheels.",
  },
  {
    question: "Can I spin by NBA division?",
    answer:
      "Yes. Popular templates include Atlantic, Central, Southeast, Northwest, Pacific, and Southwest so you can spin a five-team division rivalry pool.",
  },
  {
    question: "Does the wheel include all 30 NBA teams?",
    answer:
      "Yes. The full wheel starts with every current NBA franchise. You can remove teams, use elimination mode, or open a champions template for titled clubs only.",
  },
  {
    question: "Is this an official NBA product?",
    answer:
      "No. This is an independent fan tool for entertainment and education. Team names and facts are used for random selection only and are not affiliated with the NBA or its clubs.",
  },
  {
    question: "Can I use it for fantasy basketball drafts?",
    answer:
      "Yes. Many groups spin the NBA wheel as an icebreaker before a fantasy draft, to assign rooting interests, or to randomize which franchise theme each manager uses.",
  },
  {
    question: "Can I see team details and stats after a spin?",
    answer:
      "Yes. Open Team Details from the team list or after a result to view franchise identity (conference, division, championships), city and home venue, team colors, coach and owner, plus franchise statistics such as NBA titles and years in the league. You can also heart teams into Favorites and add clubs to Comparison for a side-by-side look. These are franchise reference facts for fun and drafts—not live player box scores.",
  },
  {
    question: "Does elimination mode work for multi-round picks?",
    answer:
      "Yes. Elimination Mode removes the winning team after each spin so later rounds choose from the remaining clubs—ideal for drafting multiple random teams in one sitting.",
  },
  {
    question: "Can I save my NBA wheel?",
    answer:
      "Yes. Use My Wheels to keep conference filters and custom selections on this device for your next draft night or watch party.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The NBA Picker Wheel is mobile-friendly, so you can spin random NBA teams on phones, tablets, and desktops.",
  },
  {
    question: "Is the NBA Picker Wheel free?",
    answer:
      "Yes. You can spin random NBA teams online for free—no signup required for the core spinner.",
  },
] as const
