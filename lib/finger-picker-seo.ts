import { HOME_SITE_URL } from "@/lib/home-seo"

export const FINGER_PICKER_SITE_URL = HOME_SITE_URL
export const FINGER_PICKER_PATH = "/finger-picker"
export const FINGER_PICKER_URL = `${FINGER_PICKER_SITE_URL}${FINGER_PICKER_PATH}`
export const FINGER_PICKER_OG_IMAGE_URL = `${FINGER_PICKER_SITE_URL}/og/finger-picker.svg`

export const FINGER_PICKER_PAGE_TITLE =
  "Finger Picker | Random Finger Selector Online"

export const FINGER_PICKER_PAGE_DESCRIPTION =
  "Free online finger picker: everyone puts a finger on the screen and one is chosen at random. Who goes first, last finger standing, elimination, and finger roulette—no names required."

export const FINGER_PICKER_H1 = "Finger Picker"

export const FINGER_PICKER_SHORT_TITLE = "Finger Picker"

export const FINGER_PICKER_HERO_INTRO =
  "Finger Picker is a live multiplayer chooser, not a list wheel. Two to ten people place a finger (or a click) on the board. After a short countdown, one finger is selected at random—perfect for who goes first, truth or dare, and last-finger-standing games."

export const FINGER_PICKER_KEYWORDS = [
  "finger picker",
  "finger picker wheel",
  "finger picker online",
  "random finger picker",
  "finger selector",
  "random finger selector",
  "finger roulette",
  "finger chooser",
  "who goes first",
  "random player selector",
  "finger picker game",
  "last finger standing",
] as const

export const FINGER_PICKER_ON_THIS_PAGE = [
  { id: "fp-popular", label: "Popular finger picker modes" },
  { id: "fp-board", label: "Use the Finger Picker" },
  { id: "fp-how", label: "How finger picking works" },
  { id: "fp-modes", label: "Modes & games" },
  { id: "fp-why", label: "Why not a name wheel?" },
  { id: "fp-related", label: "Related tools" },
  { id: "fp-faq", label: "FAQ" },
] as const

export type FingerPickerLinkItem = {
  label: string
  href: string
  description: string
}

export const FINGER_PICKER_POPULAR: FingerPickerLinkItem[] = [
  { label: "Who Goes First?", href: "/who-goes-first", description: "Fair first-turn picker for board games and class." },
  { label: "Finger Roulette", href: "/finger-roulette", description: "Classic everyone-holds-a-finger random pick." },
  { label: "Last Finger Standing", href: "/last-finger-standing", description: "Eliminate until one finger remains." },
  { label: "Random Player Picker", href: "/random-player-picker", description: "Choose one person from the live board." },
  { label: "Finger Picker Game", href: "/finger-picker-game", description: "Party modes: teams, truth or dare, lucky finger." },
  { label: "Random Finger Selector", href: "/random-finger-selector", description: "A generator-style random finger chooser." },
]

export const FINGER_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Finger Picker?",
    answer:
      "It is a live random chooser. People place fingers (or clicks on desktop) on the screen. After a countdown, one or more fingers are selected at random. It is not the same as spinning a list of names.",
  },
  {
    question: "How many people can play?",
    answer: "Two to ten fingers at once. Extra touches are ignored until someone lifts a finger.",
  },
  {
    question: "Does it work without a touchscreen?",
    answer:
      "Yes. On a mouse or trackpad, click the board to drop a finger marker. Click a marker to remove it, then press Pick.",
  },
  {
    question: "What is Last Finger Standing?",
    answer:
      "Elimination mode. The selected finger is removed from later rounds until one player remains.",
  },
  {
    question: "Is Finger Picker fair?",
    answer:
      "Yes. Every active finger has an equal chance. Position on the screen does not change the odds, except in Lucky Finger where closeness to the target is scored as a bonus highlight.",
  },
] as const

export const FINGER_PICKER_RELATED_TOOLS: FingerPickerLinkItem[] = [
  { label: "Random Name Picker", href: "/", description: "Spin a list of names when people cannot share a screen." },
  { label: "Team Picker Wheel", href: "/spin-random-team-picker-wheel", description: "Split a roster into random teams." },
  { label: "Yes or No Wheel", href: "/spin-random-yes-no-picker-wheel", description: "A binary decision spinner." },
  { label: "Decision Wheel", href: "/decision-wheel", description: "A dedicated random decision maker." },
  { label: "Number Wheel", href: "/spin-random-number-picker-wheel", description: "Pick a random number instead of a person." },
  { label: "Custom Spin Wheel", href: "/create-custom-wheel-spinner", description: "Build any list into a shareable wheel." },
  { label: "Truth or Dare Wheel", href: "/truth-or-dare-wheel-of-fortune", description: "Prompt wheel when you need written dares." },
]

export const FINGER_PICKER_ARTICLE_TITLE = "How to Use Finger Picker"
