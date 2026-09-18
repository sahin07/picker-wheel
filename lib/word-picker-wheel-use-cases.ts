import { useWheelManagerStore } from "@/stores/wheel-manager-store"

export type WordPickerCategoryId =
  | "categories"
  | "writing"
  | "classroom"
  | "games"
  | "drawing"
  | "speaking"
  | "kids"
  | "word-type"
  | "difficulty"
  | "length"
  | "letter"
  | "special"
  | "questions"
  | "party"

/** Core + expansion pack ids (expansion registered at module load). */
export type WordPickerUseCaseId = string

export type WordPickerUseCaseAccent =
  | "sky"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "teal"

export type WordPickerUseCaseConfig = {
  words: string[]
  templateParam: string
  elimination: boolean
  toolTitle: string
  toolDescription: string
  category: WordPickerCategoryId
  defaultMode?:
    | "one"
    | "three"
    | "five"
    | "story"
    | "drawing"
    | "acting"
    | "definition"
    | "spelling"
    | "speed"
    | "elimination"
}

export type WordPickerUseCase = {
  id: WordPickerUseCaseId
  label: string
  description: string
  accent: WordPickerUseCaseAccent
  config: WordPickerUseCaseConfig
}

const colors = ["#0ea5e9", "#22c55e", "#a855f7", "#f59e0b", "#ec4899", "#14b8a6"] as const

export const WORD_PICKER_USE_CASES: WordPickerUseCase[] = [
  {
    id: "common",
    label: "Common Words",
    description: "Everyday words for quick spins and warm-ups.",
    accent: "sky",
    config: {
      category: "categories",
      templateParam: "common",
      elimination: false,
      toolTitle: "Common Words Wheel",
      toolDescription: "Spin everyday words for writing and games",
      words: [
        "Adventure", "Bridge", "Cloud", "Dream", "Echo", "Forest",
        "Garden", "Horizon", "Island", "Journey", "Light", "Mountain",
      ],
    },
  },
  {
    id: "funny",
    label: "Funny Words",
    description: "Playful words for parties and icebreakers.",
    accent: "violet",
    config: {
      category: "categories",
      templateParam: "funny",
      elimination: false,
      toolTitle: "Funny Words Wheel",
      toolDescription: "Spin silly words for laughs and prompts",
      words: [
        "Bamboozle", "Flabbergasted", "Gobbledygook", "Hullabaloo", "Kerfuffle", "Noodle",
        "Quibble", "Rambunctious", "Snickerdoodle", "Whimsical", "Zany", "Brouhaha",
      ],
    },
  },
  {
    id: "writing",
    label: "Writing Words",
    description: "Prompt words for creative writing challenges.",
    accent: "emerald",
    config: {
      category: "writing",
      templateParam: "writing",
      elimination: false,
      defaultMode: "one",
      toolTitle: "Writing Prompt Word Wheel",
      toolDescription: "Random words for creative writing prompts",
      words: [
        "Secret", "Midnight", "Promise", "Storm", "Mirror", "Shadow",
        "Letter", "Map", "Doorway", "Whisper", "Treasure", "Memory",
      ],
    },
  },
  {
    id: "story",
    label: "Story Words",
    description: "Character, setting, and plot spark words.",
    accent: "amber",
    config: {
      category: "writing",
      templateParam: "story",
      elimination: false,
      defaultMode: "story",
      toolTitle: "Story Word Generator",
      toolDescription: "Spin story ingredients for fiction prompts",
      words: [
        "Detective", "Castle", "Stranger", "Desert", "Robot", "Lighthouse",
        "Rival", "Forest", "Potion", "Train", "Captain", "Library",
      ],
    },
  },
  {
    id: "poetry",
    label: "Poetry Words",
    description: "Lyrical words for poems and verses.",
    accent: "violet",
    config: {
      category: "writing",
      templateParam: "poetry",
      elimination: false,
      toolTitle: "Poetry Word Picker",
      toolDescription: "Spin evocative words for poetry challenges",
      words: [
        "Moonlight", "Silence", "River", "Bloom", "Ash", "Velvet",
        "Thunder", "Petal", "Horizon", "Pulse", "Amber", "Tide",
      ],
    },
  },
  {
    id: "classroom",
    label: "Classroom Vocab",
    description: "Vocabulary practice with no-repeat ready.",
    accent: "rose",
    config: {
      category: "classroom",
      templateParam: "classroom",
      elimination: true,
      defaultMode: "elimination",
      toolTitle: "Classroom Word Picker",
      toolDescription: "Random vocabulary words for class practice",
      words: [
        "Analyze", "Compare", "Describe", "Explain", "Infer", "Predict",
        "Summarize", "Contrast", "Evidence", "Opinion", "Topic", "Detail",
      ],
    },
  },
  {
    id: "vocab",
    label: "Vocabulary",
    description: "General vocabulary builder words.",
    accent: "teal",
    config: {
      category: "classroom",
      templateParam: "vocab",
      elimination: true,
      toolTitle: "Vocabulary Word Wheel",
      toolDescription: "Spin vocabulary words for study and review",
      words: [
        "Benevolent", "Curious", "Diligent", "Eloquent", "Fragile", "Genuine",
        "Honest", "Immense", "Jubilant", "Keen", "Logical", "Modest",
      ],
    },
  },
  {
    id: "spelling",
    label: "Spelling Words",
    description: "Words for spelling bees and practice.",
    accent: "amber",
    config: {
      category: "classroom",
      templateParam: "spelling",
      elimination: true,
      toolTitle: "Spelling Word Wheel",
      toolDescription: "Random spelling words for practice drills",
      words: [
        "Because", "Friend", "Beautiful", "Together", "Important", "Different",
        "Believe", "Receive", "Enough", "Through", "Thought", "People",
      ],
    },
  },
  {
    id: "sight",
    label: "Sight Words",
    description: "High-frequency words for early readers.",
    accent: "teal",
    config: {
      category: "classroom",
      templateParam: "sight",
      elimination: true,
      toolTitle: "Sight Word Picker",
      toolDescription: "Spin high-frequency sight words for reading",
      words: [
        "the", "and", "you", "that", "was", "for", "are", "with",
        "his", "they", "this", "have", "from", "one", "had", "word",
      ],
    },
  },
  {
    id: "esl",
    label: "ESL Words",
    description: "Useful words for English learners.",
    accent: "sky",
    config: {
      category: "classroom",
      templateParam: "esl",
      elimination: true,
      toolTitle: "ESL Word Wheel",
      toolDescription: "Practice everyday English vocabulary",
      words: [
        "Hello", "Please", "Thank", "Sorry", "Help", "Family",
        "School", "Work", "Food", "Water", "Happy", "Today",
      ],
    },
  },
  {
    id: "kids",
    label: "Kids Words",
    description: "Simple, family-friendly words for kids.",
    accent: "sky",
    config: {
      category: "kids",
      templateParam: "kids",
      elimination: false,
      toolTitle: "Kids Word Wheel",
      toolDescription: "Easy words for kids games and stories",
      words: [
        "Cat", "Dog", "Sun", "Ball", "Tree", "Fish",
        "Book", "Star", "Cake", "Bird", "Moon", "Friend",
      ],
    },
  },
  {
    id: "preschool",
    label: "Preschool Words",
    description: "Very simple words for preschoolers.",
    accent: "rose",
    config: {
      category: "kids",
      templateParam: "preschool",
      elimination: false,
      toolTitle: "Preschool Word Wheel",
      toolDescription: "Short words for preschool learning games",
      words: [
        "Red", "Blue", "Up", "Down", "Big", "Small",
        "Go", "Stop", "Yes", "No", "Me", "You",
      ],
    },
  },
  {
    id: "action",
    label: "Action Words",
    description: "Verbs for acting, drawing, and movement games.",
    accent: "violet",
    config: {
      category: "word-type",
      templateParam: "action",
      elimination: false,
      defaultMode: "acting",
      toolTitle: "Action Word Wheel",
      toolDescription: "Spin action verbs for games and prompts",
      words: [
        "Jump", "Run", "Climb", "Whisper", "Dance", "Build",
        "Explore", "Hide", "Search", "Throw", "Catch", "Create",
      ],
    },
  },
  {
    id: "pictionary",
    label: "Pictionary Words",
    description: "Drawable words for party sketch games.",
    accent: "amber",
    config: {
      category: "games",
      templateParam: "pictionary",
      elimination: true,
      defaultMode: "drawing",
      toolTitle: "Pictionary Word Wheel",
      toolDescription: "Random words to draw in Pictionary",
      words: [
        "Pizza", "Rocket", "Dinosaur", "Umbrella", "Guitar", "Castle",
        "Butterfly", "Submarine", "Wizard", "Telescope", "Sandwich", "Volcano",
      ],
    },
  },
  {
    id: "charades",
    label: "Charades Words",
    description: "Act-out words for charades night.",
    accent: "rose",
    config: {
      category: "games",
      templateParam: "charades",
      elimination: true,
      defaultMode: "acting",
      toolTitle: "Charades Word Wheel",
      toolDescription: "Random words to act out in charades",
      words: [
        "Swimming", "Cooking", "Driving", "Sleeping", "Reading", "Flying",
        "Surfing", "Painting", "Skiing", "Laughing", "Typing", "Fishing",
      ],
    },
  },
  {
    id: "challenge",
    label: "Word Challenge",
    description: "Mixed challenge words for speed rounds.",
    accent: "emerald",
    config: {
      category: "games",
      templateParam: "challenge",
      elimination: false,
      defaultMode: "three",
      toolTitle: "Word Challenge Wheel",
      toolDescription: "Spin challenge words for timed games",
      words: [
        "Courage", "Puzzle", "Spark", "Orbit", "Quilt", "Vault",
        "Nectar", "Glyph", "Prism", "Canyon", "Flame", "Echo",
      ],
    },
  },
  {
    id: "five-words",
    label: "Five Word Challenge",
    description: "Mixed words for five-word writing challenges.",
    accent: "violet",
    config: {
      category: "questions",
      templateParam: "five-words",
      elimination: false,
      defaultMode: "five",
      toolTitle: "Five Random Words",
      toolDescription: "Spin five words for bigger challenges",
      words: [
        "Courage", "Puzzle", "Spark", "Orbit", "Quilt", "Vault",
        "Nectar", "Glyph", "Prism", "Canyon", "Flame", "Echo",
        "Bridge", "Shadow", "Lantern",
      ],
    },
  },
  {
    id: "drawing",
    label: "Drawing Words",
    description: "Things to sketch or doodle.",
    accent: "sky",
    config: {
      category: "drawing",
      templateParam: "drawing",
      elimination: false,
      defaultMode: "drawing",
      toolTitle: "Random Drawing Word",
      toolDescription: "Spin a word for your next sketch",
      words: [
        "Dragon", "Lighthouse", "Owl", "Bicycle", "Clouds", "Robot",
        "Garden", "Ship", "Fox", "Mountain", "Lantern", "Bridge",
      ],
    },
  },
  {
    id: "speaking",
    label: "Speaking Topics",
    description: "Words to spark talks and debates.",
    accent: "teal",
    config: {
      category: "speaking",
      templateParam: "speaking",
      elimination: false,
      toolTitle: "Random Speaking Topic",
      toolDescription: "Spin a word for impromptu speaking",
      words: [
        "Friendship", "Travel", "Technology", "Nature", "Music", "Education",
        "Courage", "Food", "Sports", "Future", "Family", "Creativity",
      ],
    },
  },
  {
    id: "acting",
    label: "Acting Prompts",
    description: "Words and emotions to perform.",
    accent: "violet",
    config: {
      category: "speaking",
      templateParam: "acting",
      elimination: false,
      defaultMode: "acting",
      toolTitle: "Acting Prompt Wheel",
      toolDescription: "Spin a prompt to act out",
      words: [
        "Surprise", "Anger", "Joy", "Fear", "Confusion", "Pride",
        "Shyness", "Excitement", "Boredom", "Wonder", "Panic", "Relief",
      ],
    },
  },
  {
    id: "noun",
    label: "Nouns",
    description: "People, places, and things.",
    accent: "sky",
    config: {
      category: "word-type",
      templateParam: "noun",
      elimination: false,
      toolTitle: "Noun Word Wheel",
      toolDescription: "Spin random nouns for grammar and games",
      words: [
        "Teacher", "Ocean", "Window", "Market", "Engine", "Pillow",
        "Village", "Camera", "Thunder", "Notebook", "Harbor", "Ladder",
      ],
    },
  },
  {
    id: "verb",
    label: "Verbs",
    description: "Action and state-of-being words.",
    accent: "emerald",
    config: {
      category: "word-type",
      templateParam: "verb",
      elimination: false,
      toolTitle: "Verb Word Wheel",
      toolDescription: "Spin random verbs for writing and ESL",
      words: [
        "Imagine", "Discover", "Listen", "Gather", "Decide", "Protect",
        "Invent", "Wonder", "Arrive", "Transform", "Remember", "Celebrate",
      ],
    },
  },
  {
    id: "adjective",
    label: "Adjectives",
    description: "Describing words for richer writing.",
    accent: "amber",
    config: {
      category: "word-type",
      templateParam: "adjective",
      elimination: false,
      toolTitle: "Adjective Word Wheel",
      toolDescription: "Spin descriptive adjectives",
      words: [
        "Brave", "Quiet", "Ancient", "Bright", "Gentle", "Mysterious",
        "Rapid", "Soft", "Vivid", "Empty", "Golden", "Stormy",
      ],
    },
  },
  {
    id: "beginner",
    label: "Beginner Words",
    description: "Easy words for new learners.",
    accent: "teal",
    config: {
      category: "difficulty",
      templateParam: "beginner",
      elimination: false,
      toolTitle: "Beginner Words Wheel",
      toolDescription: "Simple words for beginners",
      words: [
        "Happy", "House", "Water", "Green", "Sleep", "Music",
        "Table", "Smile", "River", "Paper", "Light", "Story",
      ],
    },
  },
  {
    id: "advanced",
    label: "Advanced Words",
    description: "Challenging vocabulary for older students.",
    accent: "rose",
    config: {
      category: "difficulty",
      templateParam: "advanced",
      elimination: false,
      toolTitle: "Advanced Words Wheel",
      toolDescription: "Spin advanced vocabulary words",
      words: [
        "Ephemeral", "Resilient", "Ambiguous", "Pragmatic", "Eloquent", "Meticulous",
        "Obsolete", "Formidable", "Intrinsic", "Nuanced", "Serendipity", "Ubiquitous",
      ],
    },
  },
  {
    id: "three-letter",
    label: "3-Letter Words",
    description: "Short words for quick rounds.",
    accent: "sky",
    config: {
      category: "length",
      templateParam: "three-letter",
      elimination: false,
      toolTitle: "3-Letter Words Wheel",
      toolDescription: "Spin random three-letter words",
      words: [
        "Cat", "Dog", "Sun", "Box", "Map", "Sky",
        "Run", "Jar", "Ink", "Owl", "Cup", "Key",
      ],
    },
  },
  {
    id: "five-letter",
    label: "5-Letter Words",
    description: "Five-letter words for puzzles and games.",
    accent: "violet",
    config: {
      category: "length",
      templateParam: "five-letter",
      elimination: false,
      toolTitle: "5-Letter Words Wheel",
      toolDescription: "Spin random five-letter words",
      words: [
        "Apple", "Brave", "Cloud", "Dream", "Eagle", "Flame",
        "Grape", "House", "Image", "Jumbo", "Knife", "Lemon",
      ],
    },
  },
  {
    id: "long",
    label: "Long Words",
    description: "Longer words for spelling challenges.",
    accent: "amber",
    config: {
      category: "length",
      templateParam: "long",
      elimination: false,
      toolTitle: "Long Words Wheel",
      toolDescription: "Spin long words for challenge rounds",
      words: [
        "Imagination", "Celebration", "Adventure", "Wonderful", "Magnificent", "Interesting",
        "Beautiful", "Extraordinary", "Personality", "Environment", "Opportunity", "Understanding",
      ],
    },
  },
  {
    id: "letter-a",
    label: "Words With A",
    description: "Words that start with the letter A.",
    accent: "emerald",
    config: {
      category: "letter",
      templateParam: "letter-a",
      elimination: false,
      toolTitle: "Words Starting With A",
      toolDescription: "Spin random words beginning with A",
      words: [
        "Apple", "Anchor", "Artist", "Autumn", "Arrow", "Atlas",
        "Amber", "Astronaut", "Avenue", "Avalanche", "Axiom", "Azure",
      ],
    },
  },
  {
    id: "random-az",
    label: "A–Z Words",
    description: "A mixed alphabet word pack.",
    accent: "sky",
    config: {
      category: "letter",
      templateParam: "random-az",
      elimination: false,
      toolTitle: "Random A–Z Word Wheel",
      toolDescription: "Spin words from across the alphabet",
      words: [
        "Anchor", "Bridge", "Comet", "Delta", "Ember", "Falcon",
        "Galaxy", "Harbor", "Island", "Jewel", "Kite", "Lantern",
      ],
    },
  },
  {
    id: "animal",
    label: "Animal Words",
    description: "Animals for kids, drawing, and games.",
    accent: "teal",
    config: {
      category: "special",
      templateParam: "animal",
      elimination: false,
      toolTitle: "Animal Words Wheel",
      toolDescription: "Spin random animal words",
      words: [
        "Tiger", "Penguin", "Elephant", "Fox", "Dolphin", "Owl",
        "Panda", "Shark", "Rabbit", "Eagle", "Koala", "Wolf",
      ],
    },
  },
  {
    id: "food",
    label: "Food Words",
    description: "Foods for games, drawing, and prompts.",
    accent: "amber",
    config: {
      category: "special",
      templateParam: "food",
      elimination: false,
      toolTitle: "Food Words Wheel",
      toolDescription: "Spin random food words",
      words: [
        "Pizza", "Mango", "Sushi", "Bagel", "Taco", "Noodle",
        "Berry", "Pasta", "Waffle", "Salad", "Cookie", "Soup",
      ],
    },
  },
  {
    id: "halloween",
    label: "Halloween Words",
    description: "Spooky seasonal word pack.",
    accent: "violet",
    config: {
      category: "special",
      templateParam: "halloween",
      elimination: false,
      toolTitle: "Halloween Words Wheel",
      toolDescription: "Spin Halloween-themed words",
      words: [
        "Pumpkin", "Ghost", "Witch", "Candy", "Bat", "Costume",
        "Spider", "Moon", "Skeleton", "Haunted", "Treat", "Shadow",
      ],
    },
  },
  {
    id: "party",
    label: "Party Words",
    description: "Icebreaker and party-game prompts (family-friendly).",
    accent: "rose",
    config: {
      category: "party",
      templateParam: "party",
      elimination: true,
      defaultMode: "acting",
      toolTitle: "Party Word Generator",
      toolDescription: "Family-friendly party and icebreaker word prompts",
      words: [
        "Dance", "Confetti", "Karaoke", "Balloon", "Toast", "Playlist",
        "Costume", "Laugh", "Highfive", "Spotlight", "Surprise", "Cheer",
      ],
    },
  },
]

/** Hub popular pack chips (subset). */
export const WORD_PICKER_HUB_USE_CASE_IDS: WordPickerUseCaseId[] = [
  "common",
  "funny",
  "writing",
  "story",
  "classroom",
  "sight",
  "kids",
  "action",
]

/** Register generated expansion packs (idempotent). */
export function registerWordPickerExpansionPacks(
  packs: ReadonlyArray<{
    id: string
    category: WordPickerCategoryId
    accent: WordPickerUseCaseAccent
    label: string
    description: string
    words: string[]
    elimination?: boolean
    defaultMode?: WordPickerUseCaseConfig["defaultMode"]
  }>,
) {
  for (const pack of packs) {
    if (WORD_PICKER_USE_CASES.some((item) => item.id === pack.id)) continue
    WORD_PICKER_USE_CASES.push({
      id: pack.id,
      label: pack.label,
      description: pack.description,
      accent: pack.accent,
      config: {
        category: pack.category,
        templateParam: pack.id,
        elimination: pack.elimination ?? false,
        toolTitle: pack.label,
        toolDescription: pack.description,
        words: [...pack.words],
        defaultMode: pack.defaultMode,
      },
    })
  }
}

export function getWordPickerUseCase(
  id: string | null | undefined,
): WordPickerUseCase | undefined {
  return WORD_PICKER_USE_CASES.find((item) => item.id === id)
}

export function wordPickerUseCaseFromTemplate(
  template: string | null | undefined,
): WordPickerUseCaseId | null {
  if (!template) return null
  const match = WORD_PICKER_USE_CASES.find(
    (item) => item.config.templateParam === template || item.id === template,
  )
  return match?.id ?? null
}

export function applyWordPickerUseCase(id: WordPickerUseCaseId) {
  const useCase = getWordPickerUseCase(id)
  if (!useCase) return false

  const { updateWheelData, getCurrentWheel, setCurrentTool, createNewWheel } =
    useWheelManagerStore.getState()

  setCurrentTool("word-picker-wheel")
  let wheel = getCurrentWheel()
  if (!wheel || wheel.toolType !== "word-picker-wheel") {
    createNewWheel("word-picker-wheel", useCase.config.toolTitle)
    wheel = useWheelManagerStore.getState().getCurrentWheel()
  }
  if (!wheel) return false

  const timestamp = Date.now()
  const options = useCase.config.words.map((name, index) => ({
    id: `word-${useCase.id}-${timestamp}-${index}`,
    name,
    color: colors[index % colors.length],
    weight: 1,
    enabled: true,
  }))

  updateWheelData("word-picker-wheel", wheel.id, {
    ...wheel.data,
    options,
    totalSpins: 0,
    lastResult: null,
    recentResults: [],
    spinHistory: [],
    selectedResult: null,
    toolTitle: useCase.config.toolTitle,
    toolDescription: useCase.config.toolDescription,
    activeUseCaseId: useCase.id,
    activeCategory: useCase.config.category,
  })
  return true
}
