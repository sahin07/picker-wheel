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
  | "what-to-do"
  | "movie-watch"
  | "draw-prompt"
  | "anime-watch"

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
        "Pictionary",
        "Uno",
        "Catan",
        "Jackbox",
        "Mario Kart",
        "Among Us",
        "Jenga",
        "Heads Up",
        "Would You Rather",
        "Two Truths",
        "Never Have I Ever",
        "Dance-Off",
        "Karaoke",
        "Twister",
        "Card Game",
        "Board Game",
        "Video Game",
        "Escape Room Puzzle",
        "Spot It",
        "Monopoly Deal",
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
  {
    id: "what-to-do",
    label: "What To Do Wheel",
    description:
      "Beat boredom with a random activity pick from a ready-made idea list.",
    accent: "teal",
    config: {
      templateParam: "what-to-do",
      entries: entries("what-to-do", [
        "Go for a Walk",
        "Stretch for 10 Minutes",
        "Tidy One Spot",
        "Call a Friend",
        "Read a Chapter",
        "Sketch Something",
        "Try a New Recipe",
        "Write in a Journal",
        "Learn 5 New Words",
        "Do a Quick Workout",
        "Water the Plants",
        "Listen to a Podcast",
        "Plan Tomorrow",
        "Take Photos Outside",
        "Play a Board Game",
        "Bake Something Simple",
        "Organize One Drawer",
        "Watch a Documentary",
        "Practice an Instrument",
        "Do a Puzzle",
        "Meditate 5 Minutes",
        "Dance to One Song",
        "Start a Mini Project",
        "Visit Somewhere Nearby",
        "Clean Your Desk",
        "Text Someone Kind",
        "Learn One New Skill Clip",
        "Fold Laundry",
        "Make a Playlist",
        "Step Outside for Fresh Air",
      ]),
    },
  },
  {
    id: "movie-watch",
    label: "Movie Night Wheel",
    description:
      "Pick tonight's movie with one fair spin across moods and genres.",
    accent: "indigo",
    config: {
      templateParam: "movie-watch",
      entries: entries("movie-watch", [
        "The Shawshank Redemption",
        "Inception",
        "The Dark Knight",
        "Spirited Away",
        "Toy Story",
        "Back to the Future",
        "Jurassic Park",
        "The Matrix",
        "Forrest Gump",
        "Home Alone",
        "The Princess Bride",
        "Interstellar",
        "Finding Nemo",
        "The Lion King",
        "Titanic",
        "The Avengers",
        "Harry Potter",
        "The Lord of the Rings",
        "Star Wars",
        "Knives Out",
        "Paddington",
        "The Grand Budapest Hotel",
        "Spider-Man: Into the Spider-Verse",
        "Coco",
        "The Incredibles",
        "Wonder Woman",
        "Howl's Moving Castle",
        "Ocean's Eleven",
        "La La Land",
        "Wall-E",
      ]),
    },
  },
  {
    id: "draw-prompt",
    label: "Drawing Prompt Wheel",
    description:
      "Spin a random drawing idea when the blank page wins too often.",
    accent: "rose",
    config: {
      templateParam: "draw-prompt",
      entries: entries("draw-prompt", [
        "Your Pet as a Hero",
        "A Cozy Cabin",
        "Underwater City",
        "Favorite Food",
        "Dragon in the Clouds",
        "Self-Portrait",
        "Robot Best Friend",
        "Enchanted Forest",
        "A Rainy Window",
        "Space Explorer",
        "Tiny House on a Leaf",
        "Your Dream Room",
        "A Friendly Monster",
        "Mountain Sunrise",
        "Old Lighthouse",
        "Cat in a Costume",
        "Floating Island",
        "Street Market Scene",
        "A Magic Potion Shop",
        "Bird on a Branch",
        "Your Hand Holding Something",
        "Retro Car",
        "Something From Memory",
        "Mash Up Two Animals",
        "A Crowded Train",
        "Moonlit Garden",
        "Broken Robot on a Bench",
        "Storm Over the Ocean",
        "A Library No One Uses",
        "Your Favorite Pair of Shoes",
      ]),
    },
  },
  {
    id: "anime-watch",
    label: "Anime Picker Wheel",
    description:
      "Choose your next anime series with a fair spin across genres.",
    accent: "violet",
    config: {
      templateParam: "anime-watch",
      entries: entries("anime-watch", [
        "One Piece",
        "Attack on Titan",
        "Demon Slayer",
        "Jujutsu Kaisen",
        "My Hero Academia",
        "Death Note",
        "Fullmetal Alchemist: Brotherhood",
        "Spy x Family",
        "One Punch Man",
        "Haikyuu!!",
        "Naruto",
        "Hunter x Hunter",
        "Chainsaw Man",
        "Frieren",
        "Mob Psycho 100",
        "Steins;Gate",
        "Violet Evergarden",
        "Cowboy Bebop",
        "Dragon Ball Z",
        "Your Name",
        "Vinland Saga",
        "Sword Art Online",
        "Bleach",
        "Tokyo Ghoul",
        "Made in Abyss",
        "The Apothecary Diaries",
        "Oshi no Ko",
        "Blue Lock",
        "Dandadan",
        "Solo Leveling",
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
