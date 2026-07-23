import { PRIZE_WHEEL_PATH } from "@/lib/prize-wheel-seo"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type PrizeWheelUseCaseId =
  | "giveaway"
  | "discount"
  | "classroom"
  | "birthday"
  | "trade-show"
  | "holiday"
  | "office"
  | "fundraising"
  | "loyalty"
  | "twitch"
  | "custom"

export type PrizeWheelUseCaseAccent =
  | "amber"
  | "blue"
  | "emerald"
  | "indigo"
  | "orange"
  | "pink"
  | "purple"
  | "rose"
  | "sky"
  | "teal"
  | "violet"

export type PrizeWheelEntry = {
  id: string
  name: string
  imageUrl?: string
  color?: string
  enabled: boolean
  winMessage?: string
}

export type PrizeWheelUseCaseConfig = {
  entries: PrizeWheelEntry[]
  templateParam: string
}

export type PrizeWheelUseCase = {
  id: PrizeWheelUseCaseId
  label: string
  description: string
  accent: PrizeWheelUseCaseAccent
  config: PrizeWheelUseCaseConfig
}

const colors = ["#f59e0b", "#ec4899", "#3b82f6", "#22c55e"] as const

function entries(
  prefix: string,
  names: readonly string[],
): PrizeWheelEntry[] {
  return names.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name,
    color: colors[index % colors.length],
    enabled: true,
    winMessage: `You won ${name}!`,
  }))
}

export const PRIZE_WHEEL_USE_CASES: PrizeWheelUseCase[] = [
  {
    id: "giveaway",
    label: "Giveaway Prizes",
    description: "Run an engaging equal-chance promotional prize giveaway.",
    accent: "amber",
    config: {
      templateParam: "giveaway",
      entries: entries("giveaway", ["Stickers", "Merch", "Shoutout", "Grand Prize"]),
    },
  },
  {
    id: "discount",
    label: "Discount Offers",
    description: "Let customers spin for a discount or special offer.",
    accent: "emerald",
    config: {
      templateParam: "discount",
      entries: entries("discount", ["5% Off", "10% Off", "Free Shipping", "Mystery Deal"]),
    },
  },
  {
    id: "classroom",
    label: "Classroom Rewards",
    description: "Celebrate student effort with fun classroom rewards.",
    accent: "blue",
    config: {
      templateParam: "classroom",
      entries: entries("classroom", [
        "Homework Pass",
        "Extra Recess",
        "Stickers",
        "Mystery Prize",
      ]),
    },
  },
  {
    id: "birthday",
    label: "Birthday Party",
    description: "Add an interactive prize moment to a birthday celebration.",
    accent: "pink",
    config: {
      templateParam: "birthday",
      entries: entries("birthday", ["Candy", "Small Gift", "Party Favor", "Big Surprise"]),
    },
  },
  {
    id: "trade-show",
    label: "Trade Show",
    description: "Attract booth visitors with branded prizes and offers.",
    accent: "indigo",
    config: {
      templateParam: "trade-show",
      entries: entries("trade-show", [
        "Free Sample",
        "Swag Bag",
        "Discount Code",
        "Grand Giveaway",
      ]),
    },
  },
  {
    id: "holiday",
    label: "Holiday Prizes",
    description: "Create a festive wheel for seasonal events and promotions.",
    accent: "rose",
    config: {
      templateParam: "holiday",
      entries: entries("holiday", [
        "Ornament",
        "Gift Card",
        "Hot Cocoa Kit",
        "Mystery Gift",
      ]),
    },
  },
  {
    id: "office",
    label: "Office Rewards",
    description: "Recognize colleagues with useful and memorable rewards.",
    accent: "sky",
    config: {
      templateParam: "office",
      entries: entries("office", [
        "Coffee Card",
        "Early Leave",
        "Team Lunch",
        "Recognition Award",
      ]),
    },
  },
  {
    id: "fundraising",
    label: "Fundraising Event",
    description: "Thank supporters with prizes at a fundraising event.",
    accent: "purple",
    config: {
      templateParam: "fundraising",
      entries: entries("fundraising", [
        "Raffle Ticket",
        "Donor Swag",
        "VIP Thank-You",
        "Grand Prize",
      ]),
    },
  },
  {
    id: "loyalty",
    label: "Customer Loyalty",
    description: "Reward returning customers with perks and recognition.",
    accent: "teal",
    config: {
      templateParam: "loyalty",
      entries: entries("loyalty", [
        "Points Boost",
        "Free Item",
        "Exclusive Badge",
        "VIP Reward",
      ]),
    },
  },
  {
    id: "twitch",
    label: "Stream Rewards",
    description: "Create an interactive prize moment for your live community.",
    accent: "violet",
    config: {
      templateParam: "twitch",
      entries: entries("twitch", [
        "Emote Unlock",
        "Sub Giveaway",
        "Merch Drop",
        "Shoutout",
      ]),
    },
  },
  {
    id: "custom",
    label: "Custom Prize Wheel",
    description: "Start with four equal prizes and make the wheel your own.",
    accent: "orange",
    config: {
      templateParam: "custom",
      entries: entries("custom", ["Prize A", "Prize B", "Prize C", "Prize D"]),
    },
  },
]

export function getPrizeWheelUseCase(
  id: PrizeWheelUseCaseId,
): PrizeWheelUseCase | undefined {
  return PRIZE_WHEEL_USE_CASES.find((useCase) => useCase.id === id)
}

export function prizeWheelUseCaseFromTemplate(
  template: string | null,
): PrizeWheelUseCaseId | null {
  const value = (template || "").toLowerCase().trim()
  const ids = PRIZE_WHEEL_USE_CASES.map((useCase) => useCase.id)
  if ((ids as string[]).includes(value)) return value as PrizeWheelUseCaseId

  if (value === "giveaways" || value === "promo" || value === "promotion") return "giveaway"
  if (value === "coupon" || value === "coupons" || value === "deal") return "discount"
  if (value === "school" || value === "student" || value === "reward") return "classroom"
  if (value === "party") return "birthday"
  if (value === "tradeshow" || value === "expo" || value === "booth") return "trade-show"
  if (value === "seasonal" || value === "christmas") return "holiday"
  if (value === "work" || value === "team") return "office"
  if (value === "fundraiser" || value === "charity") return "fundraising"
  if (value === "customer" || value === "vip") return "loyalty"
  if (value === "stream" || value === "streaming") return "twitch"
  if (value === "blank" || value === "start" || value === "new") return "custom"
  return null
}

export function applyPrizeWheelUseCase(id: PrizeWheelUseCaseId): boolean {
  const useCase = getPrizeWheelUseCase(id)
  if (!useCase) return false

  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "prize-wheel") {
    store.setCurrentTool("prize-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("prize-wheel", "Prize Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("prize-wheel", wheel.id, {
    ...(wheel.data as object),
    entries: useCase.config.entries,
    viewMode: "wheel",
  })

  if (typeof window !== "undefined" && window.location.pathname === PRIZE_WHEEL_PATH) {
    const url = new URL(window.location.href)
    url.searchParams.set("template", useCase.config.templateParam)
    window.history.replaceState({}, "", `${url.pathname}${url.search}`)
  }

  return true
}
