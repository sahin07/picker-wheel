import { HOME_SITE_URL } from "@/lib/home-seo"

export const LETTER_PICKER_SITE_URL = HOME_SITE_URL

/** Canonical pillar path — primary keyword URL. */
export const LETTER_PICKER_PATH = "/random-letter-picker"

/** Legacy path kept as a redirect alias to the pillar. */
export const LETTER_PICKER_LEGACY_PATH = "/letter-picker-wheel"

export const LETTER_PICKER_URL = `${LETTER_PICKER_SITE_URL}${LETTER_PICKER_PATH}`

export const LETTER_PICKER_PAGE_TITLE =
  "Random Letter Picker | Spin the Alphabet Wheel Online"

export const LETTER_PICKER_PAGE_DESCRIPTION =
  "Use our free Random Letter Picker to spin the alphabet wheel and choose letters instantly. Create a custom letter wheel, generate random letters from A to Z, and make fair selections for games, classrooms, and learning."

export const LETTER_PICKER_H1 = "Random Letter Picker"

/** Short chrome title above the tool (not the SEO H1). */
export const LETTER_PICKER_SHORT_TITLE = "Letter Picker Wheel"

export const LETTER_PICKER_HERO_INTRO =
  "Need to choose a random letter? Our Random Letter Picker lets you spin a customizable alphabet wheel to instantly select a letter from A to Z. It's perfect for classroom activities, word games, creative writing, educational exercises, and any situation where you need a fair, random letter selection."

export const LETTER_PICKER_KEYWORDS = [
  "random letter picker",
  "random letter generator",
  "letter picker",
  "letter spinner",
  "random alphabet picker",
  "spin letter wheel",
  "alphabet wheel",
  "random letter wheel",
  "choose a random letter",
  "wheel of letters",
  "random alphabet generator",
  "pick a letter",
  "generate a letter",
  "alphabet spinner",
  "random letter selector",
  "A to Z wheel",
  "alphabet picker",
  "choose letters randomly",
  "letter picker wheel",
  "phonics letter wheel",
] as const

export const LETTER_PICKER_ON_THIS_PAGE = [
  { id: "lp-popular-wheels", label: "Popular letter wheels" },
  { id: "lp-spin-wheel", label: "Spin the letter wheel" },
  { id: "lp-create-wheel", label: "Create your letter wheel" },
  { id: "lp-options", label: "How this tool's options work" },
  { id: "lp-use-cases", label: "Common uses" },
  { id: "lp-why", label: "Why use a random letter picker" },
  { id: "lp-vs-generator", label: "Picker vs generator" },
  { id: "lp-related", label: "Related tools" },
  { id: "lp-faq", label: "FAQ" },
] as const

export type LetterPickerLinkItem = {
  label: string
  href: string
  description: string
}

/** Cluster spokes use dedicated routes; A–M / N–Z stay query deep links on the pillar. */
export const LETTER_PICKER_POPULAR_WHEELS: LetterPickerLinkItem[] = [
  {
    label: "A–Z Letter Wheel",
    href: "/alphabet-wheel",
    description: "Spin the full alphabet for general random letter picks.",
  },
  {
    label: "Vowel Picker",
    href: "/vowel-picker",
    description: "A, E, I, O, U—ideal for phonics and vowel practice.",
  },
  {
    label: "Consonant Picker",
    href: "/consonant-picker",
    description: "Spin consonants only for blending and word-building games.",
  },
  {
    label: "Phonics Letter Wheel",
    href: "/phonics-letter-wheel",
    description: "Vowel spins with sound cues and classroom practice prompts.",
  },
  {
    label: "A–M Letter Wheel",
    href: `${LETTER_PICKER_PATH}?preset=a-m`,
    description: "First half of the alphabet for shorter classroom lists.",
  },
  {
    label: "N–Z Letter Wheel",
    href: `${LETTER_PICKER_PATH}?preset=n-z`,
    description: "Second half of the alphabet for focused letter drills.",
  },
  {
    label: "Uppercase Letter Wheel",
    href: "/uppercase-letter-picker",
    description: "Capital letters for early learners and print practice.",
  },
  {
    label: "Lowercase Letter Wheel",
    href: "/lowercase-letter-picker",
    description: "Lowercase letters for reading and handwriting warm-ups.",
  },
  {
    label: "Scrabble Letter Wheel",
    href: "/scrabble-letter-picker",
    description: "Letter tiles with Scrabble-style weights for word games.",
  },
]

export const LETTER_PICKER_CREATE_POINTS = [
  {
    title: "Use A–Z",
    description:
      "Start with the full alphabet wheel, then spin to choose a random letter from A to Z.",
  },
  {
    title: "Remove letters",
    description:
      "Disable or delete slices you do not want—perfect after elimination rounds or when skipping tricky letters.",
  },
  {
    title: "Add custom letters",
    description:
      "Build your own set in the List or Text tab: repeated letters, mixed case, or a short custom alphabet.",
  },
  {
    title: "Change colors",
    description:
      "Apply palettes and per-slice colors so your alphabet spinner matches classroom themes or brand colors.",
  },
  {
    title: "Shuffle entries",
    description:
      "Shuffle the letter list before you spin so the wheel layout feels fresh for each activity.",
  },
  {
    title: "Save wheels",
    description:
      "Keep custom letter wheels in My Wheels on this device and reopen them for the next lesson or game night.",
  },
] as const

/** Explains each Letter Controls option for the complete guide. */
export const LETTER_PICKER_OPTIONS_GUIDE = [
  {
    title: "Action Mode",
    description:
      "Normal Mode keeps every letter on the wheel after a spin. Elimination Mode removes the winning letter (synced with Manage → Remove winner) so later spins pick from what’s left—ideal for classroom rounds where each letter should appear once.",
  },
  {
    title: "List tab (slices & weights)",
    description:
      "Add, edit, enable, or delete letter slices one by one. Adjust weight to change odds, pick per-slice colors, or use Reset A–Z to restore the full alphabet. Clear results when you want a fresh spin history.",
  },
  {
    title: "Manage menu",
    description:
      "Sort Z–A, Shuffle, Equalize weights, Search slices, Remove winner, Delete blanks, Remove duplicates, or Clear all. These bulk actions keep a long alphabet list tidy before you spin.",
  },
  {
    title: "Text tab & CSV",
    description:
      "Paste one letter per line (or letter + weight) and tap Apply text. Use CSV import/export when you already have a letter list from a spreadsheet or another wheel.",
  },
  {
    title: "Letter case",
    description:
      "In Style, choose Uppercase (A, B, C), Lowercase (a, b, c), or Mixed Case. Match classroom worksheets, phonics cards, or game rules that care about case.",
  },
  {
    title: "Preset set",
    description:
      "Load Full Alphabet (A–Z), Vowels only, Consonants only, or keep a Custom list. Popular templates and spoke pages use these presets so you do not rebuild the set by hand.",
  },
  {
    title: "Color palettes",
    description:
      "Apply Style palettes (Default, Warm, Ocean, Candy, and more) or Randomize colors so the letter wheel is easy to read on a projector or stream.",
  },
  {
    title: "Other Options & Share",
    description:
      "Import, Export, Share, Embed, QR Code, Fullscreen, and OBS Overlay live under Other Options—plus giveaway tools and utilities like Probability Calculator and Saved Wheels when you need them.",
  },
] as const

export const LETTER_PICKER_USE_CASES_SEO = [
  {
    title: "Classroom learning",
    href: `${LETTER_PICKER_PATH}?mode=classroom`,
    description:
      "Loads A–Z with elimination so each letter is used once. After you spin, you get a letter-of-the-turn card plus a classroom prompt and how many letters remain.",
  },
  {
    title: "Alphabet practice",
    href: `${LETTER_PICKER_PATH}?mode=alphabet-practice`,
    description:
      "Full A–Z wheel for early learners. The result card shows a large letter with an “as in …” example word and a simple recognition tip.",
  },
  {
    title: "Phonics games",
    href: `${LETTER_PICKER_PATH}?mode=phonics`,
    description:
      "Switches the wheel to vowels only (A E I O U). The result includes a phoneme cue (for example /æ/) and a short sound-practice prompt.",
  },
  {
    title: "Spelling activities",
    href: `${LETTER_PICKER_PATH}?mode=spelling`,
    description:
      "Uses consonants as starter letters for spelling bees and word lists. After the spin, you are asked to spell a word that begins with that letter.",
  },
  {
    title: "Word games",
    href: `${LETTER_PICKER_PATH}?mode=word-games`,
    description:
      "Loads Scrabble-weighted tiles so common letters appear more often. The result card shows the letter plus its Scrabble point value for word-building play.",
  },
  {
    title: "Creative writing prompts",
    href: `${LETTER_PICKER_PATH}?mode=creative-writing`,
    description:
      "Uses a mixed-case alphabet. After you spin, you get a writing seed—character names, places, or story openers that must start with that letter.",
  },
  {
    title: "Icebreaker games",
    href: `${LETTER_PICKER_PATH}?mode=icebreaker`,
    description:
      "A–Z with elimination for fair turns. The result asks everyone to share a favorite food, movie, place, or hobby that starts with the spun letter.",
  },
  {
    title: "Family games",
    href: `${LETTER_PICKER_PATH}?mode=family-games`,
    description:
      "Lowercase A–Z for party and travel rounds. Each result is a timed family challenge—act it out, name three things, or draw something that starts with the letter.",
  },
  {
    title: "ESL lessons",
    href: `${LETTER_PICKER_PATH}?mode=esl`,
    description:
      "Focuses on A–M for shorter drills. The result card gives a pronunciation or vocabulary task tied to the letter and an example word.",
  },
  {
    title: "Quiz games",
    href: `${LETTER_PICKER_PATH}?mode=quiz`,
    description:
      "Uses N–Z with elimination. After you spin, players answer a category question (country, animal, food, and more) that starts with that letter.",
  },
] as const

export const LETTER_PICKER_WHY_POINTS = [
  {
    title: "Fair random selection",
    description:
      "Equal weights give every enabled letter the same chance—or adjust weights when you want Scrabble-style odds.",
  },
  {
    title: "Interactive spinning",
    description:
      "A spinning alphabet wheel builds anticipation and keeps groups engaged—better than a silent random letter generator.",
  },
  {
    title: "Easy customization",
    description:
      "Switch A–Z, vowels, consonants, colors, and titles without installing software.",
  },
  {
    title: "No downloads",
    description:
      "Open the Random Letter Picker in your browser and spin instantly.",
  },
  {
    title: "Mobile friendly",
    description:
      "Use the letter spinner on phones, tablets, and desktops for on-the-spot classroom or game picks.",
  },
  {
    title: "Works instantly",
    description:
      "No signup required to choose a random letter. Save wheels locally when you want to reuse a setup.",
  },
] as const

export const LETTER_PICKER_COMPARISON = [
  {
    aspect: "Experience",
    picker: "Interactive alphabet wheel everyone can watch",
    generator: "Instant letter result with minimal UI",
  },
  {
    aspect: "Best for",
    picker: "Classrooms, games, and live group activities",
    generator: "Fast personal picks and automation-style use",
  },
  {
    aspect: "Engagement",
    picker: "Visual, engaging spin builds anticipation",
    generator: "Simple generation—quick but less theatrical",
  },
  {
    aspect: "Customization",
    picker: "A–Z sets, vowels, consonants, colors, elimination",
    generator: "Usually a single random letter output",
  },
  {
    aspect: "Fairness feel",
    picker: "Shared visual proof of the random letter pick",
    generator: "Trusted for speed, less shared spectacle",
  },
] as const

export const LETTER_PICKER_RELATED_TOOLS: LetterPickerLinkItem[] = [
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin names for classrooms, giveaways, and decisions.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Spin a number wheel for ranges, bingo, and classroom picks.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "A simple decision wheel for binary choices.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Spin for a random color for design and art challenges.",
  },
  {
    label: "Country Picker Wheel",
    href: "/country-picker-wheel",
    description: "Pick a random country for geography games and travel prompts.",
  },
  {
    label: "Team Picker",
    href: "/team-picker-wheel",
    description: "Split people into random teams for sports and class.",
  },
  {
    label: "Image Picker",
    href: "/image-picker-wheel",
    description: "Spin photos and images for visual random choices.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable custom spin wheel for any list.",
  },
]

export const LETTER_PICKER_ARTICLE_TITLE = "Spin the Letter Wheel"

export const LETTER_PICKER_ARTICLE_INTRO = [
  "A Random Letter Picker turns the alphabet into an interactive spinning wheel. Instead of generating a quiet character in a text box, you spin a letter spinner so students, friends, or viewers can see the selection happen live.",
  "This free alphabet wheel works as a random letter generator and letter picker in one visual tool. Start with A–Z, switch to vowels or consonants, customize colors, remove letters, and spin for a fair random letter—ideal when you want both randomness and a shared experience.",
  "Need a focused template? Open dedicated pages for the Alphabet Wheel, Vowel Picker, Consonant Picker, Scrabble-style weights, uppercase/lowercase practice, or the Phonics Letter Wheel—each with its own guide. On this pillar, Common Uses modes go further: Phonics loads vowels with sound cues, Word games apply Scrabble points, Classroom and Quiz remove letters after each pick, and Creative writing or Icebreaker modes return activity prompts seeded by the letter.",
] as const

export const LETTER_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Random Letter Picker?",
    answer:
      "A Random Letter Picker is an online alphabet wheel that selects a letter at random from a set you define—usually A–Z, vowels, consonants, or a custom list. You spin the letter wheel to choose a random letter for games, classrooms, and learning activities.",
  },
  {
    question: "Is every letter equally likely to be selected?",
    answer:
      "Yes—when each letter has the same weight, every enabled slice has an equal chance. You can change weights in the List tab (for example Scrabble-style tile odds) if you intentionally want uneven probabilities.",
  },
  {
    question: "Can I remove certain letters?",
    answer:
      "Yes. Disable or delete slices you do not want, or use elimination mode (Remove winner) so each selected letter leaves the wheel until you reset.",
  },
  {
    question: "Can I create my own alphabet wheel?",
    answer:
      "Yes. Use presets (A–Z, vowels, consonants), switch uppercase or lowercase, or enter a custom letter list in the Text tab. Change colors, shuffle entries, and save the wheel in My Wheels.",
  },
  {
    question: "What's the difference between a letter picker and a letter generator?",
    answer:
      "A random letter generator usually returns an instant letter with a simple interface. A letter picker (or letter spinner) shows a visual alphabet wheel spin, which is better for classrooms, games, and group activities. Both can produce fair random letters; the wheel adds interaction and shared visibility.",
  },
  {
    question: "What do the Common Uses modes do?",
    answer:
      "Each Common Uses mode loads a matching letter set and shows a mode-specific result card after you spin. For example, Phonics uses vowels with sound cues, Word games shows Scrabble points, Classroom and Quiz remove letters after each spin, and Creative writing gives a prompt seeded by the letter. Tap a mode above the wheel or open a deep link like ?mode=phonics.",
  },
  {
    question: "Can I use it for classroom activities?",
    answer:
      "Absolutely. Teachers use the Random Letter Picker for alphabet practice, phonics games, spelling warm-ups, ESL lessons, and fair student turns. Choose Classroom learning in Common Uses for elimination so each letter is used once. The spin is visible to the whole class.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The letter spinner is mobile-friendly, so you can spin a random letter on phones, tablets, and desktops without installing an app.",
  },
  {
    question: "Can I save my custom letter wheel?",
    answer:
      "Yes. Use My Wheels to keep custom letter wheels on this device so you can reopen a saved alphabet set, vowel wheel, or title later. No account is required to start spinning.",
  },
] as const

/** Preset IDs used by popular-wheel deep links */
export type LetterPickerSeoPreset =
  | "alphabet"
  | "vowels"
  | "consonants"
  | "a-m"
  | "n-z"
  | "scrabble"

/** Scrabble English tile counts (unique letters with weights) */
export const SCRABBLE_LETTER_WEIGHTS: Record<string, number> = {
  A: 9,
  B: 2,
  C: 2,
  D: 4,
  E: 12,
  F: 2,
  G: 3,
  H: 2,
  I: 9,
  J: 1,
  K: 1,
  L: 4,
  M: 2,
  N: 6,
  O: 8,
  P: 2,
  Q: 1,
  R: 6,
  S: 4,
  T: 6,
  U: 4,
  V: 2,
  W: 2,
  X: 1,
  Y: 2,
  Z: 1,
}

export function lettersForSeoPreset(preset: LetterPickerSeoPreset): string[] {
  switch (preset) {
    case "vowels":
      return ["A", "E", "I", "O", "U"]
    case "consonants":
      return [
        "B",
        "C",
        "D",
        "F",
        "G",
        "H",
        "J",
        "K",
        "L",
        "M",
        "N",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ]
    case "a-m":
      return Array.from({ length: 13 }, (_, i) => String.fromCharCode(65 + i))
    case "n-z":
      return Array.from({ length: 13 }, (_, i) => String.fromCharCode(78 + i))
    case "scrabble":
      return Object.keys(SCRABBLE_LETTER_WEIGHTS)
    case "alphabet":
    default:
      return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  }
}
