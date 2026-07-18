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
        label: "Yes or No Picker Wheel",
        href: "/yes-no-picker-wheel",
        description: "Get a simple yes-or-no answer when you cannot decide.",
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
        href: "/team-picker",
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
        href: "/mlb-wheel",
        description: "Draw one Major League Baseball team from the league.",
        icon: Trophy,
        color: "#fb923c",
        bg: "rgba(251, 146, 60, 0.15)",
      },
      {
        label: "NBA Picker Wheel",
        href: "/nba-wheel",
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
        href: "/fortnite-wheel",
        description: "Choose a Fortnite outfit when your locker has too many options.",
        icon: Gamepad2,
        color: "#c084fc",
        bg: "rgba(192, 132, 252, 0.15)",
      },
      {
        label: "Pokemon Picker Wheel",
        href: "/pokemon-wheel",
        description: "Draw a Pokemon for a team, battle, challenge, or favorite pick.",
        icon: Sparkles,
        color: "#facc15",
        bg: "rgba(250, 204, 21, 0.15)",
      },
      {
        label: "LoL Champions Picker",
        href: "/lol-wheel",
        description: "Leave your next League champion choice to chance.",
        icon: Swords,
        color: "#60a5fa",
        bg: "rgba(96, 165, 250, 0.15)",
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
        href: "/country-wheel",
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
