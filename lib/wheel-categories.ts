import type { LucideIcon } from "lucide-react"
import {
  Users,
  Hash,
  Type,
  HelpCircle,
  Palette,
  ImageIcon,
  Calendar,
  UsersRound,
  Coins,
  Dices,
  Trophy,
  CircleDot,
  Gamepad2,
  Sparkles,
  Swords,
  Globe,
  Map,
  Wrench,
  Sun,
  Scale,
  Gift,
  Hand,
} from "lucide-react"

export type WheelItem = {
  label: string
  href?: string
  description?: string
  icon: LucideIcon
  color: string
  bg: string
}

export type WheelCategory = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  color: string
  bg: string
  items: WheelItem[]
}

export const WHEEL_CATEGORIES: WheelCategory[] = [
  {
    id: "tools-wheel-pickers",
    title: "Tools",
    description:
      "Quick randomizers for names, numbers, dates, teams, and other everyday decisions.",
    icon: Wrench,
    color: "#16a34a",
    bg: "rgba(22, 163, 74, 0.12)",
    items: [
      {
        label: "Random Name Picker",
        href: "/",
        description: "Add your own list and let the wheel select one name.",
        icon: Users,
        color: "#4ade80",
        bg: "rgba(74, 222, 128, 0.15)",
      },
      {
        label: "Spin Random Number Picker Wheel",
        href: "/spin-random-number-picker-wheel",
        description: "Choose a range and draw an unbiased number instantly.",
        icon: Hash,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "Spin Random Letter Picker Wheel",
        href: "/spin-random-letter-picker-wheel",
        description: "Generate a random letter for word games, classrooms, or creative prompts.",
        icon: Type,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
      },
      {
        label: "Spin Random Yes No Picker Wheel",
        href: "/spin-random-yes-no-picker-wheel",
        description: "Spin a free decision spinner for a random yes or no answer.",
        icon: HelpCircle,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "Spin Random Color Picker Wheel",
        href: "/spin-random-color-picker-wheel",
        description: "Let chance choose a color for your next idea or activity.",
        icon: Palette,
        color: "#f472b6",
        bg: "rgba(244, 114, 182, 0.15)",
      },
      {
        label: "Spin Random Image Picker Wheel",
        href: "/spin-random-image-picker-wheel",
        description: "Upload pictures and select one visually at random.",
        icon: ImageIcon,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
      },
      {
        label: "Spin Random Date Picker Wheel",
        href: "/spin-random-date-picker-wheel",
        description: "Draw a date for scheduling, contests, or creative prompts.",
        icon: Calendar,
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
      },
      {
        label: "Spin Random Theme Picker Wheel",
        href: "/spin-random-theme-picker-wheel",
        description: "Spin random themes for parties, writing, drawing, and classrooms.",
        icon: Sparkles,
        color: "#14b8a6",
        bg: "rgba(20, 184, 166, 0.15)",
      },
      {
        label: "Spin Random Team Picker Wheel",
        href: "/spin-random-team-picker-wheel",
        description: "Split a group into teams without preference or debate.",
        icon: UsersRound,
        color: "#4ade80",
        bg: "rgba(74, 222, 128, 0.15)",
      },
      {
        label: "Finger Picker",
        href: "/finger-picker",
        description: "Everyone puts a finger on the screen and one is chosen at random.",
        icon: Hand,
        color: "#a78bfa",
        bg: "rgba(167, 139, 250, 0.18)",
      },
      {
        label: "Coin Flip",
        description: "A digital heads-or-tails decision tool is on the way.",
        icon: Coins,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "Dice Roll",
        description: "An online dice roller will be available soon.",
        icon: Dices,
        color: "#c084fc",
        bg: "rgba(192, 132, 252, 0.15)",
      },
    ],
  },
  {
    id: "giveaways-odds-wheel-pickers",
    title: "Giveaways & Odds",
    description:
      "Run prize giveaways and weighted spins for promotions, classrooms, events, and contests.",
    icon: Gift,
    color: "#d97706",
    bg: "rgba(217, 119, 6, 0.12)",
    items: [
      {
        label: "Prize Wheel Spinner",
        href: "/prize-wheel-spinner",
        description: "Create an equal-odds prize wheel with images and winner messages.",
        icon: Gift,
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
      },
      {
        label: "Weighted Wheel Spinner",
        href: "/weighted-wheel-spinner",
        description: "Assign custom odds to every outcome and view live probabilities.",
        icon: Scale,
        color: "#a78bfa",
        bg: "rgba(167, 139, 250, 0.15)",
      },
    ],
  },
  {
    id: "wheel-of-fortune-pickers",
    title: "Wheel of Fortune",
    description:
      "Custom fortune wheels for decisions, classrooms, prizes, and group games.",
    icon: Sparkles,
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.12)",
    items: [
      {
        label: "Wheel of Fortune",
        href: "/wheel-of-fortune",
        description: "Create a custom equal-odds wheel for any decision.",
        icon: Sparkles,
        color: "#a78bfa",
        bg: "rgba(167, 139, 250, 0.15)",
      },
      {
        label: "Classroom Wheel of Fortune",
        href: "/classroom-wheel-of-fortune",
        description: "Choose classroom rewards, roles, and activities.",
        icon: Users,
        color: "#8b5cf6",
        bg: "rgba(139, 92, 246, 0.15)",
      },
      {
        label: "Prize Wheel of Fortune",
        href: "/prize-wheel-of-fortune",
        description: "Spin for rewards, giveaways, and prizes.",
        icon: Gift,
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
      },
      {
        label: "Game Night Wheel of Fortune",
        href: "/game-night-wheel-of-fortune",
        description: "Choose the next game, challenge, or wild card.",
        icon: Gamepad2,
        color: "#7c3aed",
        bg: "rgba(124, 58, 237, 0.15)",
      },
      {
        label: "Jess Coleman Wheel of Fortune",
        href: "/jess-coleman-wheel-of-fortune",
        description: "Open the Jess Coleman fan-style fortune template.",
        icon: CircleDot,
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.15)",
      },
      {
        label: "Rainey Dorbor Wheel of Fortune",
        href: "/rainey-dorbor-wheel-of-fortune",
        description: "Open the Rainey Dorbor fan-style fortune template.",
        icon: CircleDot,
        color: "#fb7185",
        bg: "rgba(251, 113, 133, 0.15)",
      },
    ],
  },
  {
    id: "sports-wheel-pickers",
    title: "Sports",
    description:
      "Choose leagues and teams at random for games, predictions, drafts, and friendly challenges.",
    icon: Trophy,
    color: "#ea580c",
    bg: "rgba(234, 88, 12, 0.12)",
    items: [
      {
        label: "MLB Picker Wheel",
        href: "/mlb-picker-wheel",
        description: "Draw one Major League Baseball team from the league.",
        icon: Trophy,
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
      },
      {
        label: "NBA Picker Wheel",
        href: "/nba-team-picker-wheel",
        description: "Let the wheel choose one professional basketball team.",
        icon: CircleDot,
        color: "#f472b6",
        bg: "rgba(244, 114, 182, 0.15)",
      },
    ],
  },
  {
    id: "video-games-wheel-pickers",
    title: "Video Games",
    description:
      "Random selectors for characters, cosmetics, and other choices from popular games.",
    icon: Gamepad2,
    color: "#9333ea",
    bg: "rgba(147, 51, 234, 0.12)",
    items: [
      {
        label: "Fortnite Skins Picker",
        href: "/fortnite-picker-wheel",
        description: "Choose a Fortnite outfit when your locker has too many options.",
        icon: Gamepad2,
        color: "#c084fc",
        bg: "rgba(192, 132, 252, 0.15)",
      },
      {
        label: "Pokémon Picker Wheel",
        href: "/pokemon-picker-wheel",
        description: "Draw a Pokemon for a team, battle, challenge, or favorite pick.",
        icon: Sparkles,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "LoL Picker Wheel",
        href: "/lol-picker-wheel",
        description: "Leave your next League champion choice to chance.",
        icon: Swords,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
      },
      {
        label: "JJK Spin Wheel picker",
        href: "/jjk-spin-the-wheel",
        description: "Pick a random Jujutsu Kaisen character, spirit, technique, or domain.",
        icon: Sparkles,
        color: "#a78bfa",
        bg: "rgba(167, 139, 250, 0.15)",
      },
      {
        label: "Demon Slayer Spin Wheel",
        href: "/demon-slayer-spin-wheel",
        description: "Pick a random Demon Slayer character, Hashira, demon, or breathing style.",
        icon: Sparkles,
        color: "#f87171",
        bg: "rgba(248, 113, 113, 0.15)",
      },
      {
        label: "Naruto Wheel",
        href: "/naruto-spin-wheel-picker",
        description: "Spin a random Naruto character, Akatsuki member, Hokage, clan, or jutsu.",
        icon: Sparkles,
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
      },
      {
        label: "DTI Wheel Outfit Picker",
        href: "/dti-wheel-outfit-picker",
        description: "Spin random Dress to Impress themes, aesthetics, and outfit challenges.",
        icon: Sparkles,
        color: "#f472b6",
        bg: "rgba(244, 114, 182, 0.15)",
      },
    ],
  },
  {
    id: "travel-world-wheel-pickers",
    title: "Travel & World",
    description:
      "Explore geography by drawing countries and US states for trips, lessons, or trivia.",
    icon: Globe,
    color: "#2563eb",
    bg: "rgba(37, 99, 235, 0.12)",
    items: [
      {
        label: "Spin Random Country Wheel",
        href: "/spin-random-country-wheel",
        description: "Draw a nation for destination ideas, study topics, or quizzes.",
        icon: Globe,
        color: "#4ade80",
        bg: "rgba(74, 222, 128, 0.15)",
      },
      {
        label: "Spin Random State Wheel",
        href: "/spin-random-state-wheel",
        description: "Select one US state for geography practice or trip inspiration.",
        icon: Map,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
      },
    ],
  },
]

export type CategoryDirectoryEntry = {
  id: string
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: string
  bg: string
}

export const SPIN_WHEELS_BASE_PATH = "/spin-wheels"

export const ALL_WHEELS_ENTRY: CategoryDirectoryEntry = {
  id: "all-wheels",
  title: "All Wheels",
  description:
    "See the complete collection of random pickers available on Picker Wheel.",
  href: `${SPIN_WHEELS_BASE_PATH}/all-wheels`,
  icon: Sun,
  color: "#ca8a04",
  bg: "rgba(202, 138, 4, 0.12)",
}

export const CATEGORY_DIRECTORY: CategoryDirectoryEntry[] = [
  ALL_WHEELS_ENTRY,
  ...WHEEL_CATEGORIES.map((category) => ({
    id: category.id,
    title: category.title,
    description: category.description,
    href: `${SPIN_WHEELS_BASE_PATH}/${category.id}`,
    icon: category.icon,
    color: category.color,
    bg: category.bg,
  })),
]

export function getCategoryById(id: string): WheelCategory | undefined {
  return WHEEL_CATEGORIES.find((category) => category.id === id)
}

export function getAllWheels(): WheelItem[] {
  return WHEEL_CATEGORIES.flatMap((category) => category.items)
}

export function getAvailableWheels(items: WheelItem[] = getAllWheels()): WheelItem[] {
  return items.filter((item) => Boolean(item.href))
}

/** Map route href → wheel-manager toolType key */
export function hrefToToolType(href: string): string {
  if (href === "/") return "picker-wheel"
  if (href === "/weighted-wheel-spinner") return "weighted-wheel"
  if (href === "/prize-wheel-spinner") return "prize-wheel"
  if (
    href === "/spin-random-theme-picker-wheel" ||
    href === "/theme-picker-wheel" ||
    href === "/random-theme-generator" ||
    href === "/party-theme-wheel" ||
    href === "/drawing-theme-wheel" ||
    href === "/writing-theme-wheel" ||
    href === "/classroom-theme-wheel" ||
    href === "/halloween-theme-wheel" ||
    href === "/christmas-theme-wheel" ||
    href === "/costume-theme-wheel" ||
    href === "/youtube-theme-wheel" ||
    href === "/tiktok-theme-wheel" ||
    href === "/photography-theme-wheel" ||
    href === "/what-theme-should-i-choose" ||
    href === "/what-theme-should-i-draw" ||
    href === "/what-theme-should-i-write-about" ||
    href === "/what-party-theme-should-i-have" ||
    href === "/what-theme-should-my-video-be"
  ) {
    return "theme-picker-wheel"
  }
  if (
    href === "/wheel-of-fortune" ||
    href === "/the-wheel-of-fortune" ||
    href === "/custom-wheel-of-fortune" ||
    href === "/classroom-wheel-of-fortune" ||
    href === "/prize-wheel-of-fortune" ||
    href === "/truth-or-dare-wheel-of-fortune" ||
    href === "/holiday-wheel-of-fortune" ||
    href === "/game-night-wheel-of-fortune" ||
    href === "/icebreaker-wheel-of-fortune" ||
    href === "/jess-coleman-wheel-of-fortune" ||
    href === "/rainey-dorbor-wheel-of-fortune"
  ) {
    return "fortune-wheel"
  }
  // Pillar SEO URLs that differ from internal toolType keys
  if (
    href === "/spin-random-number-picker-wheel" ||
    href === "/number-picker-wheel"
  ) {
    return "number-picker-wheel"
  }
  if (
    href === "/spin-random-letter-picker-wheel" ||
    href === "/random-letter-picker" ||
    href === "/letter-picker-wheel"
  ) {
    return "letter-picker-wheel"
  }
  if (
    href === "/spin-random-yes-no-picker-wheel" ||
    href === "/yes-or-no-wheel" ||
    href === "/yes-no-picker-wheel"
  ) {
    return "yes-no-picker-wheel"
  }
  if (
    href === "/spin-random-color-picker-wheel" ||
    href === "/color-picker-wheel" ||
    href === "/wheel-of-colors"
  ) {
    return "color-picker-wheel"
  }
  if (
    href === "/spin-random-image-picker-wheel" ||
    href === "/image-picker-wheel"
  ) {
    return "image-picker-wheel"
  }
  if (
    href === "/spin-random-date-picker-wheel" ||
    href === "/date-picker-wheel"
  ) {
    return "date-picker-wheel"
  }
  if (
    href === "/spin-random-country-wheel" ||
    href === "/country-picker-wheel" ||
    href === "/random-country-picker" ||
    href === "/random-country-generator" ||
    href.startsWith("/europe-country") ||
    href.startsWith("/asia-country") ||
    href.startsWith("/africa-country") ||
    href.startsWith("/north-america-country") ||
    href.startsWith("/south-america-country") ||
    href.startsWith("/oceania-country") ||
    href === "/g20-country-picker-wheel" ||
    href === "/un-country-picker-wheel" ||
    href === "/countries-by-population-picker-wheel" ||
    href === "/travel-destination-picker-wheel" ||
    href === "/random-country-to-visit-picker-wheel" ||
    href === "/favorite-countries-picker-wheel"
  ) {
    return "country-wheel"
  }
  if (
    href === "/spin-random-state-wheel" ||
    href === "/state-wheel" ||
    href === "/random-state-picker-wheel" ||
    href === "/us-state-picker-wheel" ||
    href === "/canada-province-picker-wheel" ||
    href === "/australia-state-picker-wheel" ||
    href === "/uk-region-picker-wheel" ||
    href === "/india-state-picker-wheel" ||
    href === "/germany-state-picker-wheel" ||
    href === "/japan-prefecture-picker-wheel"
  ) {
    return "state-wheel"
  }
  if (
    href === "/mlb-picker-wheel" ||
    href === "/random-mlb-team-picker-wheel" ||
    href === "/mlb-american-league-picker-wheel" ||
    href === "/mlb-national-league-picker-wheel" ||
    href === "/mlb-al-east-picker-wheel" ||
    href === "/mlb-al-central-picker-wheel" ||
    href === "/mlb-al-west-picker-wheel" ||
    href === "/mlb-nl-east-picker-wheel" ||
    href === "/mlb-nl-central-picker-wheel" ||
    href === "/mlb-nl-west-picker-wheel" ||
    href === "/mlb-world-series-winners-picker-wheel"
  ) {
    return "mlb-wheel"
  }
  if (
    href === "/nba-team-picker-wheel" ||
    href === "/random-nba-team-picker-wheel" ||
    href === "/nba-eastern-conference-picker-wheel" ||
    href === "/nba-western-conference-picker-wheel" ||
    href === "/nba-atlantic-picker-wheel" ||
    href === "/nba-central-picker-wheel" ||
    href === "/nba-southeast-picker-wheel" ||
    href === "/nba-northwest-picker-wheel" ||
    href === "/nba-pacific-picker-wheel" ||
    href === "/nba-southwest-picker-wheel" ||
    href === "/nba-championship-winners-picker-wheel"
  ) {
    return "nba-wheel"
  }
  if (
    href === "/fortnite-picker-wheel" ||
    href === "/fortnite-wheel" ||
    href === "/random-fortnite-skin-picker-wheel" ||
    href.startsWith("/fortnite-")
  ) {
    return "fortnite-wheel"
  }
  if (
    href === "/jjk-spin-the-wheel" ||
    href === "/jujutsu-kaisen-wheel" ||
    href === "/favorite-jjk-character-picker" ||
    href.startsWith("/jjk-")
  ) {
    return "jjk-wheel"
  }
  if (
    href === "/naruto-spin-wheel-picker" ||
    href === "/naruto-wheel" ||
    href === "/naruto-character-wheel" ||
    href === "/naruto-character-picker" ||
    href === "/random-naruto-character" ||
    href === "/akatsuki-wheel" ||
    href === "/hokage-wheel" ||
    href === "/uchiha-wheel" ||
    href === "/jinchuriki-wheel" ||
    href === "/kage-wheel" ||
    href === "/naruto-quiz" ||
    href.startsWith("/naruto-") ||
    href.startsWith("/what-naruto-") ||
    href.startsWith("/which-naruto-") ||
    href.startsWith("/boruto-")
  ) {
    return "naruto-wheel"
  }
  if (
    href === "/demon-slayer-spin-wheel" ||
    href === "/demon-slayer-wheel" ||
    href === "/hashira-wheel" ||
    href === "/hashira-picker" ||
    href === "/nichirin-color-wheel" ||
    href === "/upper-rank-demon-wheel" ||
    href === "/lower-rank-demon-wheel" ||
    href === "/favorite-demon-slayer-character" ||
    href === "/random-demon-slayer-character" ||
    href.startsWith("/demon-slayer-")
  ) {
    return "demon-slayer-wheel"
  }
  if (
    href === "/dti-wheel-outfit-picker" ||
    href === "/dress-to-impress-wheel" ||
    href === "/dress-to-impress-outfit-picker" ||
    href === "/random-dti-outfit-generator" ||
    href.startsWith("/dti-")
  ) {
    return "dti-wheel"
  }
  if (
    href === "/finger-picker" ||
    href === "/finger-picker-wheel" ||
    href === "/finger-picker-online" ||
    href === "/finger-picker-game" ||
    href === "/finger-picking-game" ||
    href === "/finger-roulette" ||
    href === "/finger-roulette-game" ||
    href === "/finger-selector" ||
    href === "/finger-chooser" ||
    href === "/random-finger-selector" ||
    href === "/random-finger-picker" ||
    href === "/random-finger-game" ||
    href === "/last-finger-standing" ||
    href === "/random-player-picker" ||
    href === "/pick-a-random-player" ||
    href === "/pick-a-finger-game" ||
    href === "/random-person-selector" ||
    href === "/who-goes-first" ||
    href === "/who-should-go-first" ||
    href === "/who-goes-first-in-a-game" ||
    href === "/who-gets-the-first-turn" ||
    href === "/who-should-start" ||
    href === "/who-should-be-the-leader" ||
    href === "/who-should-pick" ||
    href === "/who-should-do-it" ||
    href === "/who-gets-chosen" ||
    href === "/who-gets-the-prize"
  ) {
    return "finger-picker"
  }
  if (
    href === "/spin-random-team-picker-wheel" ||
    href === "/team-picker-wheel" ||
    href === "/team-picker" ||
    href === "/random-team-picker" ||
    href === "/random-team-generator" ||
    href === "/3-team-generator" ||
    href === "/4-team-generator" ||
    href === "/classroom-team-generator" ||
    href === "/football-team-picker" ||
    href === "/basketball-team-picker" ||
    href === "/volleyball-team-picker" ||
    href === "/esports-team-picker" ||
    href === "/office-team-builder" ||
    href === "/tournament-team-generator"
  ) {
    return "team-picker"
  }
  return href.replace(/^\//, "")
}

/** Map toolType → catalog item (label, href, icon) */
export function getToolByType(toolType: string): WheelItem | undefined {
  return getAvailableWheels().find((item) => hrefToToolType(item.href!) === toolType)
}

export function getToolLabel(toolType: string): string {
  return getToolByType(toolType)?.label || toolType
}

export function getToolHref(toolType: string): string {
  return getToolByType(toolType)?.href || `/${toolType}`
}

function normalizeToolPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/"
  const trimmed = pathname.replace(/\/+$/, "")
  return trimmed || "/"
}

function humanizePathLabel(pathname: string): string {
  const slug = normalizeToolPath(pathname).replace(/^\//, "")
  if (!slug) return "Picker Wheel"
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Category that owns this tool or spoke URL. */
export function getCategoryForPath(pathname: string): WheelCategory | undefined {
  const path = normalizeToolPath(pathname)
  const exact = WHEEL_CATEGORIES.find((category) =>
    category.items.some((item) => item.href === path),
  )
  if (exact) return exact

  const toolType = hrefToToolType(path)
  return WHEEL_CATEGORIES.find((category) =>
    category.items.some(
      (item) => item.href && hrefToToolType(item.href) === toolType,
    ),
  )
}

export type ToolBreadcrumbCrumb = {
  label: string
  /** Omit href for the current page crumb. */
  href?: string
}

/**
 * Visible trail for tool pages: Home → Category → Tool
 * (and Hub → Spoke when the URL is a spoke of a catalog hub).
 */
export function getToolBreadcrumbTrail(pathname: string): ToolBreadcrumbCrumb[] {
  const path = normalizeToolPath(pathname)

  if (path === "/create-custom-wheel-spinner") {
    return [
      { label: "Home", href: "/" },
      { label: "Create Custom Wheel" },
    ]
  }

  if (path.startsWith("/w/")) {
    return [
      { label: "Home", href: "/" },
      { label: "Create Custom Wheel", href: "/create-custom-wheel-spinner" },
      { label: humanizePathLabel(path.slice(2)) },
    ]
  }

  if (path === SPIN_WHEELS_BASE_PATH || path.startsWith(`${SPIN_WHEELS_BASE_PATH}/`)) {
    const crumbs: ToolBreadcrumbCrumb[] = [
      { label: "Home", href: "/" },
      { label: "All Wheels", href: SPIN_WHEELS_BASE_PATH },
    ]
    if (path !== SPIN_WHEELS_BASE_PATH) {
      const categoryId = path.slice(SPIN_WHEELS_BASE_PATH.length + 1)
      const category = getCategoryById(categoryId)
      crumbs.push({
        label: category?.title || ALL_WHEELS_ENTRY.title,
      })
    }
    return crumbs
  }

  const category = getCategoryForPath(path)
  const exactItem = getAvailableWheels().find((item) => item.href === path)
  const toolType = hrefToToolType(path)
  const hub = getToolByType(toolType)

  const crumbs: ToolBreadcrumbCrumb[] = [{ label: "Home", href: "/" }]

  if (category) {
    crumbs.push({
      label: category.title,
      href: `${SPIN_WHEELS_BASE_PATH}/${category.id}`,
    })
  } else {
    crumbs.push({
      label: "All Wheels",
      href: SPIN_WHEELS_BASE_PATH,
    })
  }

  const isSpoke = Boolean(hub?.href && hub.href !== path && !exactItem)

  if (isSpoke && hub?.href) {
    crumbs.push({ label: hub.label, href: hub.href })
    crumbs.push({ label: humanizePathLabel(path) })
    return crumbs
  }

  if (exactItem) {
    crumbs.push({ label: exactItem.label })
    return crumbs
  }

  if (hub) {
    crumbs.push({ label: hub.label })
    return crumbs
  }

  crumbs.push({ label: humanizePathLabel(path) })
  return crumbs
}
