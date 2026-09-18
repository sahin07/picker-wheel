import { HOME_SITE_URL } from "@/lib/home-seo"

export const WORD_PICKER_WHEEL_SITE_URL = HOME_SITE_URL
export const WORD_PICKER_WHEEL_PATH = "/spin-word-picker-wheel"
export const WORD_PICKER_WHEEL_URL = `${WORD_PICKER_WHEEL_SITE_URL}${WORD_PICKER_WHEEL_PATH}`
export const WORD_PICKER_WHEEL_OG_IMAGE_URL = `${WORD_PICKER_WHEEL_SITE_URL}/og/word-picker-wheel.svg`

/** Legacy hub path — redirects to canonical pillar */
export const WORD_PICKER_WHEEL_PREVIOUS_PATH = "/word-picker-wheel"

export const WORD_PICKER_WHEEL_SHORT_TITLE = "Word Picker Wheel"
export const WORD_PICKER_WHEEL_PAGE_TITLE =
  "Word Picker Wheel | Free Random Word Generator & Spinner"
export const WORD_PICKER_WHEEL_H1 = "Word Picker Wheel"
export const WORD_PICKER_WHEEL_PAGE_DESCRIPTION =
  "Spin a free random word picker for writing, classrooms, vocabulary, games, and brainstorming. Paste your list, use starter packs, remove repeats, and copy the result."

export const WORD_PICKER_WHEEL_HERO_INTRO =
  "Word Picker Wheel is a random word spinner for creative writing, story prompts, vocabulary practice, ESL, Pictionary-style games, and classroom challenges. Paste a custom list or load a starter pack, spin once, then re-spin, remove the word, or keep it on the wheel."

export const WORD_PICKER_WHEEL_KEYWORDS = [
  "word picker wheel",
  "random word picker",
  "random word generator",
  "random word wheel",
  "random word spinner",
  "word spinner",
  "word selector",
  "word generator wheel",
  "random word selector",
  "random vocabulary word",
  "writing word generator",
  "classroom word picker",
] as const

export const WORD_PICKER_WHEEL_ON_THIS_PAGE = [
  { id: "spin-word-picker-wheel", label: "Spin the Word Wheel" },
  { id: "word-how-it-works", label: "How it works" },
  { id: "word-features", label: "Features" },
  { id: "word-use-cases", label: "Use cases" },
  { id: "word-vs-other", label: "Word vs Letter / Name" },
  { id: "word-starter-packs", label: "Starter word packs" },
  { id: "word-related", label: "Related tools" },
  { id: "word-faq", label: "FAQ" },
] as const

export const WORD_PICKER_WHEEL_HOW_IT_WORKS = [
  "Add words one by one, or paste a full list in the Text tab (one word per line).",
  "Or pick a starter pack—writing, classroom, Pictionary, kids, or party words.",
  "Choose a challenge mode (one word, three words, story, drawing, acting, definition…).",
  "Spin or multi-pick, then copy the result, open the vocab card, or remove the word.",
] as const

export const WORD_PICKER_WHEEL_FEATURES = [
  {
    title: "Custom word lists",
    description: "Type words or paste bulk lists—one word per line.",
  },
  {
    title: "Starter packs",
    description: "Jump into writing, classroom, games, kids, and party word sets.",
  },
  {
    title: "Challenge modes",
    description:
      "One / three / five words, story, drawing, acting, definition, spelling, speed, or elimination.",
  },
  {
    title: "Multi-word picks",
    description: "Pick 1, 2, 3, 5, or 10 words at once with weighted odds.",
  },
  {
    title: "Saved packs",
    description: "Save favorite word lists in your browser and reload them anytime.",
  },
  {
    title: "Embed mode",
    description: "Copy an iframe snippet or open ?embed=1 for a chrome-light spinner.",
  },
  {
    title: "Vocab card",
    description: "Definition, part of speech, letters, syllables, synonyms, and related words.",
  },
  {
    title: "Import & filters",
    description: "Upload TXT/CSV lists and filter by letter or length.",
  },
  {
    title: "Share deep links",
    description: "Copy a link that restores your mode, pack, and word list.",
  },
  {
    title: "No-repeat mode",
    description: "Remove selected words so each spin stays fresh for class or challenges.",
  },
] as const

export const WORD_PICKER_WHEEL_USE_CASES = [
  {
    title: "Creative writing",
    description: "Spin prompt words, story ingredients, or poetry seeds when you are stuck.",
  },
  {
    title: "Classroom & ESL",
    description: "Fair vocabulary, spelling, and sight-word turns with elimination mode.",
  },
  {
    title: "Party games",
    description: "Pictionary, charades, and icebreaker prompts without repeating words.",
  },
  {
    title: "Drawing & acting",
    description: "Get a single word to sketch or act out for art and drama warm-ups.",
  },
] as const

export const WORD_PICKER_WHEEL_VS_OTHER = [
  {
    aspect: "What you spin",
    word: "Full words (nouns, verbs, prompts).",
    letter: "Single letters A–Z.",
    name: "Any custom list (often people).",
  },
  {
    aspect: "Best for",
    word: "Writing, vocab, Pictionary, charades, ESL.",
    letter: "Phonics, alphabet games, Scrabble-style drills.",
    name: "Who goes next, giveaways, teams.",
  },
  {
    aspect: "Post-spin extras",
    word: "Vocab card, multi-word challenges, story mode.",
    letter: "Phonics / classroom letter modes.",
    name: "Elimination and general list tools.",
  },
] as const

export const WORD_PICKER_WHEEL_WHY = [
  "See the random choice happen live—better for class and streams than a silent text generator.",
  "One engine powers writing, classroom, games, kids, and question-intent pages with real pack differences.",
  "Elimination, multi-pick, and share/embed make it practical for teachers and party hosts.",
] as const

export type WordPickerLinkItem = {
  label: string
  href: string
  description: string
}

export const WORD_PICKER_WHEEL_RELATED_TOOLS: WordPickerLinkItem[] = [
  {
    label: "Letter Picker Wheel",
    href: "/spin-random-letter-picker-wheel",
    description: "Spin a random letter for word games and prompts.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "General-purpose spinner for any custom list.",
  },
  {
    label: "Number Picker Wheel",
    href: "/spin-random-number-picker-wheel",
    description: "Draw a random number from a range.",
  },
  {
    label: "Color Picker Wheel",
    href: "/spin-random-color-picker-wheel",
    description: "Random colors for art and design challenges.",
  },
  {
    label: "What Should I Draw?",
    href: "/what-should-i-draw",
    description: "Drawing prompts—pair with Drawing Word mode.",
  },
  {
    label: "Team Picker",
    href: "/spin-random-team-picker-wheel",
    description: "Split people into random teams.",
  },
  {
    label: "Yes/No Picker Wheel",
    href: "/spin-random-yes-no-picker-wheel",
    description: "Quick binary decisions.",
  },
  {
    label: "Country Wheel",
    href: "/spin-random-country-wheel",
    description: "Random countries for travel and geography.",
  },
  {
    label: "Raffle Spin Wheel",
    href: "/raffle-spin-wheel",
    description: "Fair classroom and contest winner draws.",
  },
  {
    label: "Pokémon Wheel",
    href: "/pokemon-picker-wheel",
    description: "Fandom spinner—pair with Pokémon word packs later.",
  },
  {
    label: "Fortnite Wheel",
    href: "/fortnite-picker-wheel",
    description: "Game picker for skins and challenges.",
  },
  {
    label: "Wheel of Fortune",
    href: "/wheel-of-fortune",
    description: "Custom fortune-style spins for parties and class.",
  },
]

export const WORD_PICKER_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a Word Picker Wheel?",
    answer:
      "It is a free random word spinner. Put words on the wheel, spin, and get one word for writing prompts, vocabulary practice, games, or brainstorming.",
  },
  {
    question: "How is this different from the Letter Picker?",
    answer:
      "Letter Picker spins single letters. Word Picker spins full words with challenge modes and an optional definition card.",
  },
  {
    question: "Can I paste my own word list?",
    answer:
      "Yes. Open the Text tab and paste one word per line, or import a TXT/CSV file from the tools row.",
  },
  {
    question: "How do I avoid repeating the same word?",
    answer:
      "Turn on Elimination / Remove winner after spin (Action Mode or Settings). Each selected word leaves the wheel until you reset the list.",
  },
  {
    question: "Is this good for classrooms and ESL?",
    answer:
      "Yes. Use Classroom Vocab or Sight Words packs, then spin for practice, spelling, or discussion. Elimination helps every student get a unique word.",
  },
  {
    question: "Can I embed the wheel?",
    answer:
      "Yes. Use Copy embed for an iframe snippet, or open the page with ?embed=1 for a chrome-light view.",
  },
  {
    question: "Is the Word Picker Wheel free?",
    answer: "Yes. You can spin and paste lists in the browser without creating an account.",
  },
] as const
