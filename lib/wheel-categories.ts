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
        label: "Number Picker Wheel",
        href: "/number-picker-wheel",
        description: "Choose a range and draw an unbiased number instantly.",
        icon: Hash,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "Random Letter Picker",
        href: "/random-letter-picker",
        description: "Generate a random letter for word games, classrooms, or creative prompts.",
        icon: Type,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
      },
      {
        label: "Yes or No Wheel",
        href: "/yes-or-no-wheel",
        description: "Spin a free decision spinner for a random yes or no answer.",
        icon: HelpCircle,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "Color Picker Wheel",
        href: "/color-picker-wheel",
        description: "Let chance choose a color for your next idea or activity.",
        icon: Palette,
        color: "#f472b6",
        bg: "rgba(244, 114, 182, 0.15)",
      },
      {
        label: "Image Picker Wheel",
        href: "/image-picker-wheel",
        description: "Upload pictures and select one visually at random.",
        icon: ImageIcon,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
      },
      {
        label: "Date Picker Wheel",
        href: "/date-picker-wheel",
        description: "Draw a date for scheduling, contests, or creative prompts.",
        icon: Calendar,
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
      },
      {
        label: "Team Picker Wheel",
        href: "/team-picker-wheel",
        description: "Split a group into teams without preference or debate.",
        icon: UsersRound,
        color: "#4ade80",
        bg: "rgba(74, 222, 128, 0.15)",
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
        label: "Country Picker Wheel",
        href: "/country-picker-wheel",
        description: "Draw a nation for destination ideas, study topics, or quizzes.",
        icon: Globe,
        color: "#4ade80",
        bg: "rgba(74, 222, 128, 0.15)",
      },
      {
        label: "State Picker Wheel",
        href: "/state-wheel",
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
  if (href === "/random-letter-picker" || href === "/letter-picker-wheel") {
    return "letter-picker-wheel"
  }
  if (href === "/yes-or-no-wheel" || href === "/yes-no-picker-wheel") {
    return "yes-no-picker-wheel"
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
