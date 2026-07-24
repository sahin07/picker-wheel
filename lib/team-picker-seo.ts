import { HOME_SITE_URL } from "@/lib/home-seo"

export const TEAM_PICKER_SITE_URL = HOME_SITE_URL

/** Canonical pillar path — primary keyword URL. */
export const TEAM_PICKER_PATH = "/team-picker-wheel"

/** Legacy path kept as a redirect alias to the pillar. */
export const TEAM_PICKER_LEGACY_PATH = "/team-picker"

/** Alternate keyword URL — redirects to the pillar. */
export const TEAM_PICKER_ALT_PATH = "/random-team-picker"

export const TEAM_PICKER_URL = `${TEAM_PICKER_SITE_URL}${TEAM_PICKER_PATH}`

export const TEAM_PICKER_OG_IMAGE_URL = `${TEAM_PICKER_SITE_URL}/og/team-picker-wheel.svg`

export const TEAM_PICKER_PAGE_TITLE =
  "Team Picker Wheel | Create Random Teams Online"

export const TEAM_PICKER_PAGE_DESCRIPTION =
  "Create fair teams in seconds with our free Team Picker Wheel. Add names, randomly assign players, generate balanced groups, or spin to choose sports teams, classroom teams, and giveaway participants."

export const TEAM_PICKER_H1 = "Team Picker Wheel"

/** Short chrome title above the tool (not the SEO H1). */
export const TEAM_PICKER_SHORT_TITLE = "Team Picker Wheel"

export const TEAM_PICKER_HERO_INTRO =
  "Need to create random teams quickly? Our Team Picker Wheel makes it easy to split players, students, coworkers, or participants into fair groups. Add your list of names, customize the wheel, and spin to randomly assign teams for sports, classrooms, games, tournaments, meetings, or events."

export const TEAM_PICKER_KEYWORDS = [
  "team picker wheel",
  "random team picker",
  "team generator",
  "random team generator",
  "team picker",
  "spin wheel",
  "wheel spinner",
  "random picker wheel",
  "team randomizer",
  "team selection wheel",
  "create random teams",
  "assign teams randomly",
  "team assignment tool",
  "split into teams",
  "random group generator",
  "classroom team picker",
  "sports team picker",
  "tournament team generator",
  "fair team selection",
  "random team draw",
] as const

export const TEAM_PICKER_ON_THIS_PAGE = [
  { id: "tp-popular", label: "Popular team picker templates" },
  { id: "tp-spin-wheel", label: "Spin the Team Picker Wheel" },
  { id: "tp-create-teams", label: "Create random teams" },
  { id: "tp-options", label: "How this tool's options work" },
  { id: "tp-use-cases", label: "Common ways to use a team picker" },
  { id: "tp-why", label: "Why use a Team Picker Wheel" },
  { id: "tp-vs-generator", label: "Wheel vs random team generator" },
  { id: "tp-tips", label: "Fair teams & EEAT tips" },
  { id: "tp-related", label: "Related tools" },
  { id: "tp-cluster", label: "Team picker topic cluster" },
  { id: "tp-faq", label: "FAQ" },
] as const

export type TeamPickerLinkItem = {
  label: string
  href: string
  description: string
}

/** Ready-made templates — each opens its own spoke URL (same pattern as Letter/Color). */
export const TEAM_PICKER_POPULAR_TEMPLATES: TeamPickerLinkItem[] = [
  {
    label: "2 Team Generator",
    href: "/random-team-generator",
    description: "Split any roster into two fair sides for scrimmages and debates.",
  },
  {
    label: "3 Team Generator",
    href: "/3-team-generator",
    description: "Create three balanced groups for classrooms, workshops, or games.",
  },
  {
    label: "4 Team Generator",
    href: "/4-team-generator",
    description: "Ideal for schools, sports drills, and multi-station activities.",
  },
  {
    label: "Classroom Teams",
    href: "/classroom-team-generator",
    description: "Teachers: random student groups for projects, labs, and quiz bowls.",
  },
  {
    label: "Football Teams",
    href: "/football-team-picker",
    description: "Pick flag-football or backyard football sides in one spin.",
  },
  {
    label: "Basketball Teams",
    href: "/basketball-team-picker",
    description: "Randomize pickup basketball and practice squads fairly.",
  },
  {
    label: "Volleyball Teams",
    href: "/volleyball-team-picker",
    description: "Spin balanced volleyball rotations for PE and leagues.",
  },
  {
    label: "Gaming Squads",
    href: "/esports-team-picker",
    description: "Assign multiplayer squads, clan sides, and party-game teams.",
  },
  {
    label: "Office Groups",
    href: "/office-team-builder",
    description: "Workshop breakouts, brainstorming pods, and training cohorts.",
  },
  {
    label: "Tournament Brackets",
    href: "/tournament-team-generator",
    description: "Seed random tournament teams when you need a fast, fair draw.",
  },
]

export const TEAM_PICKER_READY_TEMPLATES = [
  { template: "2 Team Generator", audience: "General" },
  { template: "4 Team Generator", audience: "Schools & sports" },
  { template: "Classroom Team Picker", audience: "Teachers" },
  { template: "Football Team Picker", audience: "Coaches" },
  { template: "Basketball Team Picker", audience: "Sports fans" },
  { template: "Gaming Squad Generator", audience: "Gamers" },
  { template: "Office Team Builder", audience: "Businesses" },
  { template: "Tournament Team Picker", audience: "Event organizers" },
  { template: "Family Game Teams", audience: "Families" },
  { template: "Icebreaker Team Generator", audience: "Meetings" },
] as const

export const TEAM_PICKER_CREATE_POINTS = [
  {
    title: "Add names",
    description:
      "Type participants one by one or paste a full list in the Text tab—perfect for classroom rosters and sports sign-up sheets.",
  },
  {
    title: "Assign multiple teams",
    description:
      "Set the number of groups or max people per group so your team generator builds evenly sized sides.",
  },
  {
    title: "Remove selected players",
    description:
      "Use elimination mode (Remove winner) to take a chosen team or representative off the wheel for the next spin.",
  },
  {
    title: "Shuffle participants",
    description:
      "Shuffle names before you generate teams so the order of entry never influences who lands together.",
  },
  {
    title: "Save team wheels",
    description:
      "Keep custom team wheels in My Wheels on this device and reopen them for the next practice, lesson, or event.",
  },
  {
    title: "Share team assignments",
    description:
      "Share the spun result or export participant lists so coaches, teachers, and hosts can post assignments quickly.",
  },
  {
    title: "Customize colors",
    description:
      "Apply Style palettes and themes so each team color is easy to spot on the spinning team selection wheel.",
  },
] as const

/** Explains each Team Controls option for the complete guide. */
export const TEAM_PICKER_OPTIONS_GUIDE = [
  {
    title: "Action Mode",
    description:
      "Normal Mode keeps every team on the wheel after a spin. Elimination Mode removes the winning team (synced with Header Settings → Remove winner) so later spins pick from what’s left—ideal for drafting captains or assigning one team at a time.",
  },
  {
    title: "Add One & AI Setup",
    description:
      "Add One lets you type a single participant name. AI Setup offers quick defaults for group size and sample names so you can try the team picker without building a full roster first.",
  },
  {
    title: "Text tab (bulk import)",
    description:
      "Paste one name per line or import CSV-style lists in the Text tab. This is the fastest way to load a classroom roster, sports signup sheet, or meeting attendee list.",
  },
  {
    title: "Distribute equally (Default / Gender / Label)",
    description:
      "Default shuffles everyone into groups of similar size. Gender mode balances male and female participants across teams when you set gender on each name. Label mode spreads custom tags (skill level, grade, role) so no team gets all of one label.",
  },
  {
    title: "Pick quantity",
    description:
      "In Default mode, pick quantity controls how many people from your list are randomly arranged into groups. Leave it at the full list length to assign everyone, or lower it to draw a subset first.",
  },
  {
    title: "Number of groups",
    description:
      "Sets how many teams to create (for example 2, 3, or 4). Use this when you know you need a fixed number of sides for a scrimmage, debate, or workshop stations.",
  },
  {
    title: "Max people / group",
    description:
      "Caps how large each team can be. Useful when rooms, courts, or table sizes limit group size—the generator fills teams up to this maximum.",
  },
  {
    title: "Pick representatives",
    description:
      "When enabled, each generated team can include a representative (captain-style pick). After you generate teams, spin the wheel to highlight a team or representative for live announcements.",
  },
  {
    title: "Generate Teams",
    description:
      "Builds balanced groups from your current settings and loads them onto the wheel. This is the “random team generator” flow—assign everyone at once, then spin for fun or elimination rounds.",
  },
  {
    title: "Set Team Names & Preset Group Members",
    description:
      "Rename teams (Dragons, Blue, Table 1) so results are easy to read. Preset Group Members lets you lock certain people onto the same team before the random fill runs—handy for siblings, accessibility needs, or fixed pairs.",
  },
  {
    title: "Style, Themes & Settings",
    description:
      "Style palettes and Themes change team colors on the wheel. Header Settings control spin duration, confetti, sound, and Remove winner—those spin options stay in sync with Action Mode and the Manage menu.",
  },
  {
    title: "Results, Groups Board & Share",
    description:
      "Results and Spin History show past spins. Open Groups Board to review every team and member. Share copies the latest result so you can post assignments in chat, email, or a classroom board.",
  },
] as const

export const TEAM_PICKER_USE_CASES = [
  {
    category: "Sports",
    items: [
      "Football teams",
      "Basketball teams",
      "Baseball teams",
      "Volleyball teams",
      "Soccer teams",
    ],
  },
  {
    category: "Classroom",
    items: [
      "Student groups",
      "Science projects",
      "Reading circles",
      "Quiz teams",
      "Debate teams",
    ],
  },
  {
    category: "Workplace",
    items: [
      "Workshop groups",
      "Brainstorming teams",
      "Training sessions",
      "Meeting activities",
    ],
  },
  {
    category: "Gaming",
    items: [
      "Multiplayer squads",
      "Clan assignments",
      "Tournament teams",
      "Party games",
    ],
  },
] as const

export const TEAM_PICKER_WHY_POINTS = [
  {
    title: "Fair random assignments",
    description:
      "Every participant has an equal chance when each name appears once—ideal for fair team selection and random team draws.",
  },
  {
    title: "Faster than manual grouping",
    description:
      "Skip counting off and arguing over captains. Spin or generate teams in seconds for large groups.",
  },
  {
    title: "Great for large groups",
    description:
      "Paste long rosters, set group size, and let the team randomizer handle the split.",
  },
  {
    title: "Easy to customize",
    description:
      "Tune group count, colors, representatives, elimination mode, and saved wheels without installing software.",
  },
  {
    title: "Works on any device",
    description:
      "Use the Team Picker Wheel on phones, tablets, and desktops—perfect for the gym, classroom, or conference room.",
  },
  {
    title: "No signup required",
    description:
      "Start assigning teams free in your browser. Save wheels locally when you want to reuse a setup.",
  },
] as const

export const TEAM_PICKER_COMPARISON = [
  {
    aspect: "Interaction",
    wheel: "Interactive spinning everyone can watch",
    generator: "Instant automatic grouping",
  },
  {
    aspect: "Best for",
    wheel: "Classrooms, events, and live games",
    generator: "Faster bulk assignments for large lists",
  },
  {
    aspect: "Feel",
    wheel: "Visual team selection with shared anticipation",
    generator: "Quiet, efficient roster splits",
  },
  {
    aspect: "Games & sports",
    wheel: "Great for games, PE, and watch parties",
    generator: "Better for tournament seeding at scale",
  },
] as const

export const TEAM_PICKER_TIPS = [
  {
    title: "How team selection works",
    description:
      "When every name appears once with equal weight, each participant has the same chance of landing on a team. Spin the wheel to pick a representative team, or generate groups to assign everyone at once.",
  },
  {
    title: "Creating fair teams",
    description:
      "Remove duplicate names, keep similar list sizes, and use a fixed number of groups or max people per group so random assignments stay balanced.",
  },
  {
    title: "When to use automatic generation",
    description:
      "If you want evenly sized groups instantly, use Generate Teams (a random team generator style flow). If you want an interactive experience for classrooms, events, or live games, spin the Team Picker Wheel.",
  },
  {
    title: "Sports examples",
    description:
      "Create random NFL fan challenge teams, youth soccer practice groups, or basketball scrimmage sides—examples only; this tool is not affiliated with any league or franchise.",
  },
] as const

export const TEAM_PICKER_RELATED_TOOLS: TeamPickerLinkItem[] = [
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin names one at a time for giveaways, classrooms, and decisions.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Spin numbers for brackets, bingo, and classroom draws.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "A fast decision wheel when captains need a coin-flip call.",
  },
  {
    label: "Letter Picker Wheel",
    href: "/random-letter-picker",
    description: "Spin the alphabet for classroom warm-ups and word games.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Pick a random color for design, art, and team jersey themes.",
  },
  {
    label: "NBA Team Picker",
    href: "/nba-team-picker-wheel",
    description: "Spin for a random NBA team for fantasy and watch parties.",
  },
  {
    label: "MLB Team Picker",
    href: "/mlb-picker-wheel",
    description: "Choose a random MLB team for drafts and sports games.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable custom spin wheel for any list.",
  },
]

/** Programmatic SEO cluster — dedicated spoke URLs (no overlap with Related Tools). */
export const TEAM_PICKER_CLUSTER_LINKS: TeamPickerLinkItem[] = [
  {
    label: "Random Team Generator",
    href: "/random-team-generator",
    description: "Instant balanced groups from a name list.",
  },
  {
    label: "Classroom Team Generator",
    href: "/classroom-team-generator",
    description: "Fair student groups for projects and quiz teams.",
  },
  {
    label: "Sports Team Picker",
    href: "/basketball-team-picker",
    description: "Practice squads and pickup game sides.",
  },
  {
    label: "Random Group Generator",
    href: "/4-team-generator",
    description: "Split large lists into even groups fast.",
  },
  {
    label: "Tournament Team Generator",
    href: "/tournament-team-generator",
    description: "Seed fair tournament teams with a random draw.",
  },
  {
    label: "Esports Team Picker",
    href: "/esports-team-picker",
    description: "Assign gaming squads and clan sides randomly.",
  },
  {
    label: "Fantasy Football Team Picker",
    href: "/football-team-picker",
    description: "Fun fan teams and draft-night icebreakers.",
  },
  {
    label: "Office Team Builder",
    href: "/office-team-builder",
    description: "Workshop breakouts and brainstorming pods.",
  },
]

export const TEAM_PICKER_ARTICLE_TITLE = "Spin the Team Picker Wheel"

export const TEAM_PICKER_ARTICLE_INTRO = [
  "A Team Picker Wheel turns a list of names into an interactive spinning wheel for team assignment. Instead of quietly shuffling a spreadsheet, you spin a team selection wheel so players, students, or coworkers can see fair random teams take shape live.",
  "This free team generator works as a random team picker and random group generator in one place. Add names, choose how many teams you need, customize colors, shuffle participants, and spin—or generate balanced groups when you want everyone assigned at once.",
  "Searchers looking for a team picker wheel, random team generator, classroom team picker, or sports team picker land here for the same job: assign teams randomly without bias. Use ready-made templates for 2–4 team splits, gaming squads, office groups, and tournament brackets, then save wheels you reuse every season.",
] as const

export const TEAM_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Team Picker Wheel?",
    answer:
      "A Team Picker Wheel is an online team randomizer that helps you create random teams from a list of names. You add participants, set how many groups you need, and either spin the wheel or generate balanced teams for sports, classrooms, games, and events.",
  },
  {
    question: "Can I randomly split people into multiple teams?",
    answer:
      "Yes. Set the number of groups or max people per group, then generate teams to split your list evenly—or spin the wheel when you want an interactive team selection for live audiences.",
  },
  {
    question: "Can I remove players after they're selected?",
    answer:
      "Yes. Turn on Elimination Mode (synced with Header Settings → Remove winner) so a selected team or representative can leave the wheel until you restore everyone.",
  },
  {
    question: "Can I create balanced teams?",
    answer:
      "Yes. Use equal group counts or max people per group so teams stay similar in size. Remove duplicate names first for the fairest random team draw. Optional gender or label distribution helps when you need mixed groups.",
  },
  {
    question: "Can I save my team wheel?",
    answer:
      "Yes. Use My Wheels to keep team wheels on this device—participant lists, group settings, and colors—so you can reopen them for the next practice or class period.",
  },
  {
    question: "Is the team assignment random?",
    answer:
      "Yes. When each name appears once with equal weight, every participant has an equal chance. Shuffle before generating if you want a fresh layout each time.",
  },
  {
    question: "Can I use it for classrooms?",
    answer:
      "Absolutely. Teachers use the classroom team picker for science projects, reading circles, quiz teams, and debate sides. Paste the roster, choose group size, and generate or spin in front of the class.",
  },
  {
    question: "Can I use it for sports tournaments?",
    answer:
      "Yes. Coaches and organizers use it as a tournament team generator for practice squads, scrimmages, and fair draws. For league franchise picks, try related sports wheels like NBA or MLB team pickers.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The Team Picker Wheel is mobile-friendly, so you can create random teams on phones, tablets, and desktops without installing an app.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. You can use the Team Picker Wheel free in your browser with no signup required to start assigning teams.",
  },
] as const
