import { HOME_SITE_URL } from "@/lib/home-seo"

export const MLB_WHEEL_SITE_URL = HOME_SITE_URL

/** Canonical pillar path */
export const MLB_WHEEL_PATH = "/mlb-picker-wheel"

export const MLB_WHEEL_URL = `${MLB_WHEEL_SITE_URL}${MLB_WHEEL_PATH}`

export const MLB_WHEEL_OG_IMAGE_URL = `${MLB_WHEEL_SITE_URL}/og/mlb-picker-wheel.svg`

export const MLB_WHEEL_PAGE_TITLE =
  "MLB Picker Wheel | Random MLB Team Spinner Online Free"

export const MLB_WHEEL_PAGE_DESCRIPTION =
  "Spin a free MLB Picker Wheel to pick a random MLB team. Filter by American or National League, spin by division, compare franchises, and use it for fantasy drafts, watch parties, and baseball games."

export const MLB_WHEEL_H1 = "MLB Picker Wheel"

export const MLB_WHEEL_SHORT_TITLE = "MLB Picker Wheel"

export const MLB_WHEEL_HERO_INTRO =
  "Need a random MLB team fast? Our MLB Picker Wheel spins all 30 Major League Baseball franchises so you can draft a fantasy club, pick a watch-party side, or choose a video-game team without arguing. Filter by American or National League, load a division, customize the wheel, and spin."

export const MLB_WHEEL_KEYWORDS = [
  "mlb picker wheel",
  "mlb team wheel",
  "random mlb team",
  "mlb team spinner",
  "mlb random team generator",
  "american league wheel",
  "national league wheel",
  "mlb fantasy draft wheel",
  "baseball team picker",
  "spin the mlb wheel",
  "mlb team randomizer",
  "random baseball team",
] as const

export const MLB_WHEEL_ON_THIS_PAGE = [
  { id: "mlb-popular", label: "Popular MLB templates" },
  { id: "mlb-spin-wheel", label: "Spin the MLB Picker Wheel" },
  { id: "mlb-whats-on", label: "What you can put on the wheel" },
  { id: "mlb-features", label: "Features on this page" },
  { id: "mlb-create", label: "Build your MLB team wheel" },
  { id: "mlb-how-it-works", label: "How the MLB wheel works" },
  { id: "mlb-options", label: "How this tool's options work" },
  { id: "mlb-use-cases", label: "Ways to use an MLB wheel" },
  { id: "mlb-why", label: "Why use an MLB Picker Wheel" },
  { id: "mlb-comparison", label: "Picker wheel vs random team generator" },
  { id: "mlb-tips", label: "Fairness tips & best practices" },
  { id: "mlb-customize", label: "How to customize your wheel" },
  { id: "mlb-related", label: "Related tools" },
  { id: "mlb-cluster", label: "MLB topic cluster" },
  { id: "mlb-faq", label: "FAQ" },
] as const

export type MlbWheelLinkItem = {
  label: string
  href: string
  description: string
}

/** Popular templates — dedicated spoke URLs. */
export const MLB_WHEEL_POPULAR_TEMPLATES: MlbWheelLinkItem[] = [
  {
    label: "Random MLB Team",
    href: "/random-mlb-team-picker-wheel",
    description: "Spin all 30 MLB franchises for a fair random pick.",
  },
  {
    label: "American League",
    href: "/mlb-american-league-picker-wheel",
    description: "AL-only spinner for fantasy drafts and AL watch parties.",
  },
  {
    label: "National League",
    href: "/mlb-national-league-picker-wheel",
    description: "NL-only wheel for National League matchups and drafts.",
  },
  {
    label: "AL East",
    href: "/mlb-al-east-picker-wheel",
    description: "Yankees, Red Sox, Orioles, Rays, and Blue Jays.",
  },
  {
    label: "AL Central",
    href: "/mlb-al-central-picker-wheel",
    description: "Guardians, Twins, Tigers, White Sox, and Royals.",
  },
  {
    label: "AL West",
    href: "/mlb-al-west-picker-wheel",
    description: "Astros, Rangers, Mariners, Angels, and Athletics.",
  },
  {
    label: "NL East",
    href: "/mlb-nl-east-picker-wheel",
    description: "Braves, Phillies, Mets, Marlins, and Nationals.",
  },
  {
    label: "NL Central",
    href: "/mlb-nl-central-picker-wheel",
    description: "Cubs, Cardinals, Brewers, Reds, and Pirates.",
  },
  {
    label: "NL West",
    href: "/mlb-nl-west-picker-wheel",
    description: "Dodgers, Padres, Giants, Diamondbacks, and Rockies.",
  },
  {
    label: "World Series Winners",
    href: "/mlb-world-series-winners-picker-wheel",
    description: "Spin franchises that have won at least one World Series.",
  },
]

export const MLB_WHEEL_CREATE_POINTS = [
  {
    title: "Load all 30 teams",
    description:
      "Start with every MLB franchise on the wheel, then spin for a fully random Major League pick.",
  },
  {
    title: "Filter by league",
    description:
      "Switch to American League or National League when you only want one circuit on the spinner.",
  },
  {
    title: "Narrow by division",
    description:
      "Open a division template (AL East, NL West, and more) for tighter rivalry and fantasy pools.",
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
      "Keep custom MLB wheels in My Wheels on this device for the next draft night or watch party.",
  },
] as const

export const MLB_WHEEL_OPTIONS_GUIDE = [
  {
    title: "League filters",
    description:
      "Choose All Leagues, American League, or National League to rebuild the wheel with matching franchises.",
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
      "Add up to four teams to Comparison from the list or the compare icon in the sidebar header. The Comparison modal shows logos, leagues, divisions, and championship history side by side before you spin.",
  },
  {
    title: "Team Details",
    description:
      "Open Team Details from the list or after a spin to see franchise identity: league and division badges, World Series titles, Century Club age, city, home venue, team colors, manager, owner, and historical context (founded year and league history). Example fields match what you see for clubs like the Chicago Cubs (CHC)—Wrigley Field, primary/secondary colors, leadership, and title counts.",
  },
  {
    title: "Team Statistics",
    description:
      "Team Statistics summarize franchise facts—World Series titles, years in MLB, league, division, home venue, and founding year. This is franchise-level info for trivia and drafts, not live batter or pitcher box scores.",
  },
  {
    title: "Manual vs AI-Powered",
    description:
      "Manual lets you select teams yourself. AI-Powered can suggest balanced sets, trivia prompts, or draft-style shortlists from the current league filter.",
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

export const MLB_WHEEL_WHATS_ON_WHEEL = [
  "All 30 MLB franchises with logos, league, and division metadata",
  "League filters — American League, National League, or every team on one spinner",
  "Division templates — AL East through NL West five-team rivalry pools",
  "World Series winners template — franchises with at least one title",
  "Favorites and comparison — shortlist up to four clubs before you spin",
  "Custom text entries — add fantasy pool names or house rules in the Text tab",
] as const

export const MLB_WHEEL_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive wheel sits above this guide. All 30 teams load by default—spin without leaving the page.",
  },
  {
    title: "League and division filters",
    description:
      "Rebuild the wheel from the Inputs sidebar with AL, NL, or a single five-team division.",
  },
  {
    title: "Team Details, stats & comparison",
    description:
      "Open franchise identity, World Series titles, venue, colors, manager, and owner—plus comparison.",
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
      "Save league filters and custom team lists locally for the next draft night or classroom session.",
  },
] as const

export const MLB_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your pool",
    description:
      "Start with all 30 teams, filter to AL or NL, open a division template, or load World Series winners only.",
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
      "Click Spin or tap the wheel so everyone sees a fair random MLB team land live.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Open Team Details, assign a rooting interest, remove the winner, and spin again for the next round.",
  },
] as const

export const MLB_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Pick a template or filter",
    description:
      "Tap a Popular MLB template under Build Your Wheel, or set AL, NL, or division filters in Inputs.",
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
      "Keep your wheel in My Wheels on this device so the same league or division pool opens instantly.",
  },
] as const

export const MLB_WHEEL_COMPARISON = [
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
    wheel: "AL, NL, division, and champions templates built in",
    generator: "Usually a flat list with little filtering",
  },
  {
    aspect: "Engagement",
    wheel: "More engaging—a shared moment around the spin",
    generator: "Simpler interface, less visual buildup",
  },
] as const

export const MLB_WHEEL_EEAT_TIPS = [
  {
    id: "mlb-eeat-randomness",
    title: "How randomness works",
    body: "Each enabled MLB team on the wheel has an equal chance when it appears once. Duplicate entries or multiple slices for the same franchise increase odds—use Remove duplicates in Manage for strict fairness.",
  },
  {
    id: "mlb-eeat-fairness",
    title: "Best practices for fair picks",
    body: "Before a fantasy draft or classroom spin, confirm everyone sees the same team list. Announce results while the wheel is visible, and use elimination when each franchise should win only once.",
  },
  {
    id: "mlb-eeat-disclaimer",
    title: "Fan tool disclaimer",
    body: "This is an independent fan tool for entertainment and education—not affiliated with Major League Baseball or its clubs. Franchise facts are reference trivia, not live scores or official league data.",
  },
] as const

export const MLB_WHEEL_USE_CASES = [
  {
    category: "Fantasy & drafts",
    items: [
      "Fantasy baseball draft icebreakers",
      "Keeper league random team draws",
      "Salary-cap draft order fun spins",
    ],
  },
  {
    category: "Watch parties",
    items: [
      "Pick a team to root for tonight",
      "AL vs NL watch-party sides",
      "World Series bracket party games",
    ],
  },
  {
    category: "Games & streaming",
    items: [
      "MLB The Show franchise picks",
      "Streamer challenge random teams",
      "Bar trivia baseball rounds",
    ],
  },
  {
    category: "Classroom & camps",
    items: [
      "PE baseball unit team picks",
      "Summer camp MLB trivia spins",
      "Geography lessons by MLB cities",
    ],
  },
] as const

export const MLB_WHEEL_WHY_POINTS = [
  {
    title: "Fair random picks",
    description:
      "Every enabled franchise gets an equal spin chance—no host bias when friends argue over teams.",
  },
  {
    title: "League-ready filters",
    description:
      "Jump straight into AL, NL, or a division instead of rebuilding the list every time.",
  },
  {
    title: "Works on any device",
    description:
      "Spin on phones, tablets, or a living-room TV browser—no app install required.",
  },
  {
    title: "Free to use",
    description:
      "The MLB Picker Wheel is free for fantasy nights, classrooms, and casual baseball fun.",
  },
] as const

export const MLB_WHEEL_RELATED_TOOLS: MlbWheelLinkItem[] = [
  {
    label: "NBA Team Picker",
    href: "/nba-team-picker-wheel",
    description: "Spin a random NBA franchise for basketball drafts and games.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split custom names into fair teams for sports and classrooms.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Make quick baseball-night decisions with a yes/no spin.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin custom names, prizes, or lineup ideas.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Pick random numbers for draft slots or innings challenges.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable spinner for any baseball list.",
  },
]

export const MLB_WHEEL_CLUSTER_LINKS: MlbWheelLinkItem[] = [
  {
    label: "Random MLB Team",
    href: "/random-mlb-team-picker-wheel",
    description: "All 30 franchises on one spinner.",
  },
  {
    label: "American League Wheel",
    href: "/mlb-american-league-picker-wheel",
    description: "AL-only random team picks.",
  },
  {
    label: "National League Wheel",
    href: "/mlb-national-league-picker-wheel",
    description: "NL-only random team picks.",
  },
  {
    label: "AL East Spinner",
    href: "/mlb-al-east-picker-wheel",
    description: "Five-team AL East rivalry wheel.",
  },
  {
    label: "NL West Spinner",
    href: "/mlb-nl-west-picker-wheel",
    description: "Five-team NL West rivalry wheel.",
  },
  {
    label: "World Series Champions",
    href: "/mlb-world-series-winners-picker-wheel",
    description: "Franchises with at least one title.",
  },
  {
    label: "NBA Random Team",
    href: "/nba-team-picker-wheel",
    description: "Sister sports wheel for basketball.",
  },
  {
    label: "Custom Team Generator",
    href: "/team-picker-wheel",
    description: "Build teams from your own name list.",
  },
]

export const MLB_WHEEL_ARTICLE_TITLE = "Spin the MLB Picker Wheel"

export const MLB_WHEEL_ARTICLE_INTRO = [
  "An MLB Picker Wheel turns Major League Baseball franchises into an interactive spinner. Instead of scrolling a list or flipping a coin, you spin a baseball team wheel so everyone can see a fair random MLB team land live.",
  "Use league and division filters when you need a tighter pool—American League only, National League only, or a single division like AL East. Add favorites, compare clubs, open Team Details for venue and championship facts, eliminate winners across rounds, and save wheels you reuse every fantasy season.",
  "Searchers looking for an MLB team wheel, random MLB team generator, or baseball team spinner land here for the same job: pick an MLB franchise without bias for drafts, watch parties, video games, and classroom activities.",
] as const

export const MLB_WHEEL_FAQ_ITEMS = [
  {
    question: "What is an MLB Picker Wheel?",
    answer:
      "An MLB Picker Wheel is a free online spinner that randomly selects a Major League Baseball team. Load all 30 franchises—or filter by league and division—then spin to pick a team for fantasy drafts, watch parties, or games.",
  },
  {
    question: "Can I spin only American League or National League teams?",
    answer:
      "Yes. Use the league filters on this page or open the American League and National League template pages to load AL-only or NL-only wheels.",
  },
  {
    question: "Can I spin by MLB division?",
    answer:
      "Yes. Popular templates include AL East, AL Central, AL West, NL East, NL Central, and NL West so you can spin a five-team division rivalry pool.",
  },
  {
    question: "Does the wheel include all 30 MLB teams?",
    answer:
      "Yes. The full wheel starts with every current MLB franchise. You can remove teams, use elimination mode, or open a World Series winners template for titled clubs only.",
  },
  {
    question: "Is this an official MLB product?",
    answer:
      "No. This is an independent fan tool for entertainment and education. Team names and facts are used for random selection only and are not affiliated with Major League Baseball or its clubs.",
  },
  {
    question: "Can I use it for fantasy baseball drafts?",
    answer:
      "Yes. Many groups spin the MLB wheel as an icebreaker before a fantasy draft, to assign rooting interests, or to randomize which franchise theme each manager uses.",
  },
  {
    question: "Can I see team details and stats after a spin?",
    answer:
      "Yes. Open Team Details from the team list or after a result to view franchise identity (league, division, championships), city and home venue, team colors, manager and owner, plus franchise statistics such as World Series titles and years in MLB. You can also heart teams into Favorites and add clubs to Comparison for a side-by-side look. These are franchise reference facts for fun and drafts—not live player box scores.",
  },
  {
    question: "Does elimination mode work for multi-round picks?",
    answer:
      "Yes. Elimination Mode removes the winning team after each spin so later rounds choose from the remaining clubs—ideal for drafting multiple random teams in one sitting.",
  },
  {
    question: "Can I save my MLB wheel?",
    answer:
      "Yes. Use My Wheels to keep league filters and custom selections on this device for your next draft night or watch party.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The MLB Picker Wheel is mobile-friendly, so you can spin random MLB teams on phones, tablets, and desktops.",
  },
  {
    question: "Is the MLB Picker Wheel free?",
    answer:
      "Yes. You can spin random MLB teams online for free—no signup required for the core spinner.",
  },
] as const
