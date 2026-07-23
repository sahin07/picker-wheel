import { FORTUNE_WHEEL_PATH } from "@/lib/fortune-wheel-seo"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type FortuneWheelUseCaseId =
  | "template"
  | "decision"
  | "prize"
  | "classroom"
  | "truth-or-dare"
  | "chore"
  | "holiday"
  | "game-night"
  | "icebreaker"
  | "custom"
  | "game-show"
  | "jess-coleman"
  | "rainey-dorbor"
  | "birthday"
  | "christmas"
  | "halloween"
  | "ryan-johnston"
  | "chelsea-calabro"

export type FortuneWheelUseCaseAccent =
  | "amber"
  | "blue"
  | "emerald"
  | "indigo"
  | "orange"
  | "pink"
  | "rose"
  | "sky"
  | "teal"
  | "violet"

export type FortuneWheelEntryKind =
  | "cash"
  | "prize"
  | "bankrupt"
  | "lose_turn"
  | "special"

export type FortuneWheelEntry = {
  id: string
  name: string
  color?: string
  enabled: boolean
  kind?: FortuneWheelEntryKind
  winMessage?: string
  imageUrl?: string
}

export type FortuneWheelUseCaseConfig = {
  entries: FortuneWheelEntry[]
  templateParam: string
}

export type FortuneWheelUseCase = {
  id: FortuneWheelUseCaseId
  label: string
  description: string
  accent: FortuneWheelUseCaseAccent
  config: FortuneWheelUseCaseConfig
}

const COLORS = [
  "#7c3aed",
  "#2563eb",
  "#0891b2",
  "#16a34a",
  "#ca8a04",
  "#ea580c",
  "#e11d48",
  "#9333ea",
] as const

function entries(
  prefix: string,
  names: readonly string[],
  options?: {
    kinds?: readonly FortuneWheelEntryKind[]
    messages?: readonly string[]
  },
): FortuneWheelEntry[] {
  return names.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name,
    color: COLORS[index % COLORS.length],
    enabled: true,
    ...(options?.kinds?.[index] ? { kind: options.kinds[index] } : {}),
    ...(options?.messages?.[index]
      ? { winMessage: options.messages[index] }
      : {}),
  }))
}

export const FORTUNE_WHEEL_USE_CASES: FortuneWheelUseCase[] = [
  {
    id: "template",
    label: "Wheel of Fortune Template",
    description:
      "A starter multi-purpose wheel that is ready for any list or activity.",
    accent: "blue",
    config: {
      templateParam: "template",
      entries: entries("template", [
        "Pick Me",
        "Surprise",
        "Challenge",
        "Reward",
        "Skip",
        "Mystery",
      ]),
    },
  },
  {
    id: "decision",
    label: "Decision Wheel",
    description:
      "A flexible starting wheel for everyday choices, fresh ideas, and surprise picks.",
    accent: "violet",
    config: {
      templateParam: "decision",
      entries: entries("decision", [
        "Yes",
        "Try Again",
        "New Idea",
        "Ask a Friend",
        "Surprise",
        "Skip",
        "Go For It",
        "Mystery Pick",
      ]),
    },
  },
  {
    id: "prize",
    label: "Prize Wheel",
    description:
      "A ready-made reward and giveaway wheel that is easy to customize.",
    accent: "amber",
    config: {
      templateParam: "prize",
      entries: entries(
        "prize",
        [
          "Stickers",
          "Merch",
          "Shoutout",
          "Grand Prize",
          "Extra Spin",
          "Consolation",
        ],
        {
          kinds: ["prize", "prize", "prize", "prize", "special", "prize"],
        },
      ),
    },
  },
  {
    id: "classroom",
    label: "Classroom Wheel",
    description:
      "Spin for student-friendly rewards, privileges, and classroom roles.",
    accent: "violet",
    config: {
      templateParam: "classroom",
      entries: entries(
        "classroom",
        [
          "Homework Pass",
          "Extra Recess",
          "Pick Next Reader",
          "Mystery Reward",
          "Line Leader",
          "Quiet Prize",
        ],
        {
          kinds: ["prize", "prize", "special", "special", "special", "prize"],
        },
      ),
    },
  },
  {
    id: "truth-or-dare",
    label: "Truth or Dare Wheel",
    description:
      "Choose a truth, dare, group challenge, or surprise for party play.",
    accent: "rose",
    config: {
      templateParam: "truth-or-dare",
      entries: entries("truth-or-dare", [
        "Truth",
        "Dare",
        "Double Dare",
        "Skip",
        "Group Challenge",
        "Mystery",
      ]),
    },
  },
  {
    id: "chore",
    label: "Chore Wheel",
    description:
      "Share household jobs with a simple, visible random choice.",
    accent: "amber",
    config: {
      templateParam: "chore",
      entries: entries("chore", [
        "Dishes",
        "Trash",
        "Vacuum",
        "Laundry",
        "Wipe Counters",
        "Your Choice",
      ]),
    },
  },
  {
    id: "holiday",
    label: "Holiday Wheel",
    description:
      "Pick a festive treat, activity, gift, or seasonal surprise.",
    accent: "rose",
    config: {
      templateParam: "holiday",
      entries: entries(
        "holiday",
        [
          "Gift Exchange",
          "Hot Cocoa",
          "Movie Night",
          "Ornament Pick",
          "Mystery Gift",
          "Carol Choice",
        ],
        {
          kinds: ["prize", "prize", "special", "prize", "special", "special"],
        },
      ),
    },
  },
  {
    id: "game-night",
    label: "Game Night Wheel",
    description:
      "Let the wheel choose the next game, challenge, or playful twist.",
    accent: "violet",
    config: {
      templateParam: "game-night",
      entries: entries("game-night", [
        "Charades",
        "Trivia",
        "Draw",
        "Dance-Off",
        "Wild Card",
        "Free Pass",
      ]),
    },
  },
  {
    id: "birthday",
    label: "Birthday Wheel",
    description:
      "Spin for birthday treats, gifts, games, and light party activities.",
    accent: "pink",
    config: {
      templateParam: "birthday",
      entries: entries("birthday", [
        "Candy",
        "Small Gift",
        "Party Game",
        "Dance",
        "Sing",
        "Mystery Present",
        "Extra Slice",
        "Group Photo",
      ]),
    },
  },
  {
    id: "christmas",
    label: "Christmas Wheel",
    description:
      "Choose a festive activity, treat, gift, or seasonal surprise.",
    accent: "emerald",
    config: {
      templateParam: "christmas",
      entries: entries("christmas", [
        "Gift Exchange",
        "Hot Cocoa",
        "Carol Pick",
        "Ornament",
        "Movie Night",
        "Mystery Stocking",
      ]),
    },
  },
  {
    id: "halloween",
    label: "Halloween Wheel",
    description:
      "A fun, light spinner for treats, costumes, stories, and spooky surprises.",
    accent: "orange",
    config: {
      templateParam: "halloween",
      entries: entries("halloween", [
        "Trick",
        "Treat",
        "Costume Dare",
        "Spooky Story",
        "Candy Pass",
        "Mystery Scare",
      ]),
    },
  },
  {
    id: "icebreaker",
    label: "Icebreaker Wheel",
    description:
      "Start friendly conversations with accessible prompts for groups.",
    accent: "amber",
    config: {
      templateParam: "icebreaker",
      entries: entries("icebreaker", [
        "Two Truths",
        "Favorite Movie",
        "Fun Fact",
        "Would You Rather",
        "Compliment",
        "Mystery Prompt",
      ]),
    },
  },
  {
    id: "custom",
    label: "Custom Wheel",
    description:
      "A clean equal-choice template ready for your own labels and ideas.",
    accent: "violet",
    config: {
      templateParam: "custom",
      entries: entries("custom", [
        "Option A",
        "Option B",
        "Option C",
        "Option D",
        "Option E",
        "Option F",
      ]),
    },
  },
  {
    id: "game-show",
    label: "Classic Game-Show Wheel",
    description:
      "An optional classic cash-and-setback preset for friendly, fictional scoring.",
    accent: "amber",
    config: {
      templateParam: "game-show",
      entries: entries(
        "game-show",
        [
          "$500",
          "$1,000",
          "Prize",
          "Bankrupt",
          "Lose a Turn",
          "$2,500",
          "Mystery",
          "Extra Spin",
        ],
        {
          kinds: [
            "cash",
            "cash",
            "prize",
            "bankrupt",
            "lose_turn",
            "cash",
            "special",
            "special",
          ],
          messages: [
            "Add 500 points to your friendly round score.",
            "Add 1,000 points to your friendly round score.",
            "Reveal the prize chosen by your group.",
            "Reset this round's points if your house rules use that option.",
            "Pass play to the next person.",
            "Add 2,500 points to your friendly round score.",
            "Reveal a surprise prompt.",
            "Take one more spin.",
          ],
        },
      ),
    },
  },
  {
    id: "jess-coleman",
    label: "Jess Coleman Trending Template",
    description:
      "A ready-made spin template inspired by trending search interest; customize freely.",
    accent: "rose",
    config: {
      templateParam: "jess-coleman",
      entries: entries("jess-coleman", [
        "Bold Choice",
        "Lucky Spin",
        "Prize Pick",
        "Try Again",
        "Crowd Cheer",
        "Mystery Moment",
      ]),
    },
  },
  {
    id: "rainey-dorbor",
    label: "Rainey Dorbor Trending Template",
    description:
      "A ready-made spin template inspired by trending search interest; customize freely.",
    accent: "rose",
    config: {
      templateParam: "rainey-dorbor",
      entries: entries("rainey-dorbor", [
        "Fresh Start",
        "Lucky Pick",
        "Big Smile",
        "Extra Spin",
        "Fun Choice",
        "Mystery Moment",
      ]),
    },
  },
  {
    id: "ryan-johnston",
    label: "Ryan Johnston Trending Template",
    description:
      "Ready-made spin template inspired by trending search interest. Customize freely.",
    accent: "teal",
    config: {
      templateParam: "ryan-johnston",
      entries: entries("ryan-johnston", [
        "Big Spin",
        "Puzzle Moment",
        "Crowd Favorite",
        "Bonus Pick",
        "Wild Card",
        "Customize Me",
      ]),
    },
  },
  {
    id: "chelsea-calabro",
    label: "Chelsea Calabro Trending Template",
    description:
      "Ready-made spin template inspired by trending search interest. Customize freely.",
    accent: "sky",
    config: {
      templateParam: "chelsea-calabro",
      entries: entries("chelsea-calabro", [
        "Big Spin",
        "Puzzle Moment",
        "Crowd Favorite",
        "Bonus Pick",
        "Wild Card",
        "Customize Me",
      ]),
    },
  },
]

export function getFortuneWheelUseCase(
  id: FortuneWheelUseCaseId,
): FortuneWheelUseCase | undefined {
  return FORTUNE_WHEEL_USE_CASES.find((useCase) => useCase.id === id)
}

const TEMPLATE_ALIASES: Record<string, FortuneWheelUseCaseId> = {
  fortune: "decision",
  default: "decision",
  "wheel-of-fortune": "decision",
  "the-wheel-of-fortune": "decision",
  starter: "template",
  "wheel-template": "template",
  "wheel-of-fortune-template": "template",
  classic: "game-show",
  gameshow: "game-show",
  "game-show-style": "game-show",
  giveaway: "prize",
  rewards: "prize",
  teacher: "classroom",
  school: "classroom",
  chores: "chore",
  "chore-wheel": "chore",
  choices: "decision",
  "decision-wheel": "decision",
  party: "truth-or-dare",
  "truth-dare": "truth-or-dare",
  "game-night-wheel": "game-night",
  "birthday-wheel": "birthday",
  "christmas-wheel": "christmas",
  xmas: "christmas",
  "halloween-wheel": "halloween",
  conversation: "icebreaker",
  blank: "custom",
  jess: "jess-coleman",
  jesscoleman: "jess-coleman",
  rainey: "rainey-dorbor",
  raineydorbor: "rainey-dorbor",
  ryan: "ryan-johnston",
  ryanjohnston: "ryan-johnston",
  chelsea: "chelsea-calabro",
  chelseacalabro: "chelsea-calabro",
}

export function fortuneWheelUseCaseFromTemplate(
  template: string | null,
): FortuneWheelUseCaseId | null {
  const value = (template ?? "").toLowerCase().trim()
  if (!value) return null

  const directMatch = FORTUNE_WHEEL_USE_CASES.find(
    (useCase) => useCase.id === value || useCase.config.templateParam === value,
  )
  return directMatch?.id ?? TEMPLATE_ALIASES[value] ?? null
}

export function applyFortuneWheelUseCase(id: FortuneWheelUseCaseId): boolean {
  const useCase = getFortuneWheelUseCase(id)
  if (!useCase) return false

  const store = useWheelManagerStore.getState()
  if (store.currentTool !== "fortune-wheel") {
    store.setCurrentTool("fortune-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("fortune-wheel", "My Fortune Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  store.updateWheelData("fortune-wheel", wheel.id, {
    ...(wheel.data as object),
    entries: useCase.config.entries.map((entry) => ({ ...entry })),
    viewMode: "wheel",
  })

  if (
    typeof window !== "undefined" &&
    window.location.pathname === FORTUNE_WHEEL_PATH
  ) {
    const url = new URL(window.location.href)
    url.searchParams.set("template", useCase.config.templateParam)
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`)
  }

  return true
}
