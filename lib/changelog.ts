export type ChangelogGroup = {
  type: "Added" | "Improved" | "Fixed"
  items: string[]
}

export type ChangelogEntry = {
  version: string
  date: string
  /** ISO date for <time> / schema */
  isoDate: string
  title: string
  summary: string
  groups: ChangelogGroup[]
}

/**
 * Product changelog, curated from the site's release history.
 * Newest release first.
 */
export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v1.8",
    date: "Jul 25, 2026",
    isoDate: "2026-07-25",
    title: "Question-intent pages and richer starter lists",
    summary:
      "This release adds conversational what-* decision pages, upgrades key template spokes for question search intent, and fills starter wheels with more useful defaults.",
    groups: [
      {
        type: "Added",
        items: [
          "Launched conversational decision pages: What Should I Do, What Movie Should I Watch, What Should I Draw, What Anime Should I Watch, and What Pokémon Should I Choose.",
          "Added redirects from What Should I Eat and What Game Should I Play to the existing food and game-night spokes.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Rewrote six template spokes with question-intent titles, tips, FAQs, and visible updated dates (food, visit country, game night, who goes first, pastel color, should I).",
          "Standardized spoke SEO blocks with tips checklists, related decision links, and a single page H1.",
          "Expanded starter lists across food, game night, pastel colors, presentation order, and the new what-* wheels so pages are useful on arrival.",
          "Clarified home and help FAQ copy for Remove Winner After Spin and Create Custom Wheel share links.",
          "Explicitly allowed major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, and others) in robots.txt while keeping /api/ and /w/ private.",
        ],
      },
    ],
  },
  {
    version: "v1.7",
    date: "Jul 24, 2026",
    isoDate: "2026-07-24",
    title: "Spinifywheel rebrand and richer giveaway wheels",
    summary:
      "This release introduces the Spinifywheel brand and brings games, achievements, and shared tools to the Fortune, Prize, and Weighted wheels.",
    groups: [
      {
        type: "Added",
        items: [
          "Rolled out the new Spinifywheel brand across the header, footer, and site metadata.",
          "Added Games and Achievements to the Prize Wheel and Fortune Wheel, matching the Weighted wheel.",
          "Added a shared under-wheel actions bar (Games, Achievements, Themes, Analytics, and more) across giveaway tools.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Capped the input sidebar height on the Prize, Weighted, and Fortune wheels so long lists scroll instead of stretching the page.",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Fixed a Fortune Wheel crash that occurred when saved entries were missing.",
        ],
      },
    ],
  },
  {
    version: "v1.6",
    date: "Jul 24, 2026",
    isoDate: "2026-07-24",
    title: "Performance, security, and navigation polish",
    summary:
      "This release focuses on faster mobile loads, patched dependencies, and cleaner in-page navigation.",
    groups: [
      {
        type: "Improved",
        items: [
          "Improved mobile loading by trimming home-page JavaScript and painting the wheel shell earlier.",
          "Moved and center-aligned tool breadcrumbs so they sit cleanly below the wheel.",
          "Added Solvebytez developer credit to the footer copyright.",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Upgraded Next.js and React to patched security releases.",
        ],
      },
    ],
  },
  {
    version: "v1.5",
    date: "Jul 23, 2026",
    isoDate: "2026-07-23",
    title: "Themed wheels, articles, and legal pages",
    summary:
      "This milestone expanded the site with anime-themed wheels, guides, SEO spokes, and the pages needed for a full public site.",
    groups: [
      {
        type: "Added",
        items: [
          "Added Demon Slayer and JJK themed spin wheels.",
          "Added how-to articles and blog content for classrooms, giveaways, and game nights.",
          "Added privacy, terms, cookie, and contact pages plus updated site navigation.",
          "Added themed wheel spoke pages and dedicated SEO landing pages.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Refactored shared wheel modules so tools reuse the same spin, input, and results logic.",
        ],
      },
    ],
  },
  {
    version: "v1.4",
    date: "Jun 20, 2026",
    isoDate: "2026-06-20",
    title: "Giveaway tools and custom odds",
    summary:
      "This release deepened the giveaway toolkit with prize, weighted, and fortune wheels plus clearer odds feedback.",
    groups: [
      {
        type: "Added",
        items: [
          "Added the Prize Wheel Spinner for equal-odds giveaways, events, and classroom rewards.",
          "Added the Weighted Wheel Spinner so each option can use custom probabilities.",
          "Added the Wheel of Fortune tool for decisions, activities, and prize-style spins.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Showed probability percentages in list view so raffles and rare prizes stay transparent.",
          "Polished winner messages and result presentation for giveaway hosts.",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Tightened weight validation so empty or invalid odds no longer break a spin.",
        ],
      },
    ],
  },
  {
    version: "v1.3",
    date: "Jun 8, 2026",
    isoDate: "2026-06-08",
    title: "Templates, discoverability, and help center",
    summary:
      "This release made it easier to find the right wheel, start from a template, and get answers without leaving the site.",
    groups: [
      {
        type: "Added",
        items: [
          "Added category browsing for Tools, Sports, Video Games, and Travel & World wheels.",
          "Added popular name-picker templates under the home wheel for classroom and giveaway lists.",
          "Added the Help & FAQ center with step-by-step answers for randomness, saving, and mobile use.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Improved All Wheels navigation so tools are easier to find on desktop and mobile.",
          "Expanded game instructions for Bingo, Memory, Collection, and Sequence modes.",
        ],
      },
    ],
  },
  {
    version: "v1.2",
    date: "May 22, 2026",
    isoDate: "2026-05-22",
    title: "Games, themes, and spin analytics",
    summary:
      "This release turned the picker into a playable toolkit with game modes, themes, and simple spin stats.",
    groups: [
      {
        type: "Added",
        items: [
          "Added Games modes including Bingo, Memory Match, Collection Race, and Sequence Match.",
          "Added Achievements so repeated spins unlock progress on this device.",
          "Added Themes and Analytics panels for style presets and recent spin insights.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Refined spin sound, mute, and confetti controls for classrooms and parties.",
          "Made fullscreen mode easier to find next to the volume control.",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Fixed game status resets so starting a new mode no longer kept stale round state.",
        ],
      },
    ],
  },
  {
    version: "v1.1",
    date: "May 6, 2026",
    isoDate: "2026-05-06",
    title: "My Wheels, import/export, and everyday pickers",
    summary:
      "This release made wheels reusable between visits and grew the library of everyday decision tools.",
    groups: [
      {
        type: "Added",
        items: [
          "Added My Wheels so lists stay saved on this device and can be renamed or switched anytime.",
          "Added CSV and text import/export for backing up or pasting large name lists.",
          "Added Yes or No, Letter, Number, Color, Image, Team, Country, and State picker wheels.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Added remove-winner after spin for elimination-style classroom and giveaway rounds.",
          "Improved bulk paste so one-name-per-line lists load into the wheel in one step.",
        ],
      },
      {
        type: "Fixed",
        items: [
          "Smoothed local save behavior so edits were less likely to drop after a refresh.",
        ],
      },
    ],
  },
  {
    version: "v1.0",
    date: "Apr 15, 2026",
    isoDate: "2026-04-15",
    title: "Public launch",
    summary:
      "The first public version of the site, with the core spin-the-wheel picker ready to use in the browser.",
    groups: [
      {
        type: "Added",
        items: [
          "Launched the core custom wheel editor with spin, edit, and quick setup flows.",
          "Shipped manual list input, equal-odds slices, and results history.",
          "Included Create Custom Wheel for shareable branded spinner links.",
        ],
      },
      {
        type: "Improved",
        items: [
          "Delivered a fast, mobile-friendly wheel that works with no signup or install.",
          "Powered fair picks with browser-native randomness for transparent results.",
        ],
      },
    ],
  },
]

export const CHANGELOG_LATEST = CHANGELOG_ENTRIES[0]
