import { HOME_SITE_URL } from "@/lib/home-seo"

export const FORTUNE_WHEEL_SITE_URL = HOME_SITE_URL
export const FORTUNE_WHEEL_PATH = "/wheel-of-fortune"
export const FORTUNE_WHEEL_URL = `${FORTUNE_WHEEL_SITE_URL}${FORTUNE_WHEEL_PATH}`
export const FORTUNE_WHEEL_OG_IMAGE_URL = `${FORTUNE_WHEEL_SITE_URL}/og/wheel-of-fortune.svg`

export const FORTUNE_WHEEL_SHORT_TITLE = "Wheel of Fortune"
export const FORTUNE_WHEEL_PAGE_TITLE =
  "Wheel of Fortune | Free Online Fortune Wheel Spinner"
export const FORTUNE_WHEEL_H1 = "Wheel of Fortune"
export const FORTUNE_WHEEL_PAGE_DESCRIPTION =
  "Create and spin your own Wheel of Fortune online. Customize entries, colors, prizes, and labels for classrooms, parties, giveaways, games, team activities, and fun random decisions."

export const FORTUNE_WHEEL_HERO_INTRO =
  "Create your own Wheel of Fortune in seconds. Add custom entries, personalize the colors and appearance, then spin the wheel to make random choices for games, classrooms, parties, giveaways, and team activities. Whether you're hosting an event or just looking for a fun way to make decisions, the wheel is easy to customize and works on any device."
export const FORTUNE_WHEEL_DISCLAIMER =
  "This is an independent online wheel tool for entertainment and everyday decisions. It is not affiliated with or endorsed by the Wheel of Fortune television show, Sony, or CBS."

export const FORTUNE_WHEEL_KEYWORDS = [
  "wheel of fortune",
  "wheel of fortune game",
  "wheel of fortune spinner",
  "wheel of fortune online",
  "online fortune wheel",
  "free fortune wheel",
  "fortune wheel generator",
  "fortune wheel maker",
  "custom wheel of fortune",
  "wheel of fortune template",
  "random fortune wheel",
  "spin the wheel online",
  "customizable spinning wheel",
  "classroom fortune wheel",
  "prize fortune wheel",
  "decision wheel",
  "party spinner wheel",
  "game night wheel",
  "wheel with custom entries",
  "shareable spin wheel",
] as const

export const FORTUNE_WHEEL_ON_THIS_PAGE = [
  { id: "fortune-spin-wheel", label: "Spin the fortune wheel" },
  { id: "fortune-how-it-works", label: "How it works" },
  { id: "fortune-features", label: "Customization features" },
  { id: "fortune-templates", label: "Popular templates" },
  { id: "fortune-use-cases", label: "Ways to use the wheel" },
  { id: "fortune-benefits", label: "Benefits" },
  { id: "fortune-vs-picker", label: "Wheel of Fortune vs random picker" },
  { id: "fortune-related", label: "Related wheel tools" },
  { id: "fortune-disclaimer", label: "Independent tool disclaimer" },
  { id: "fortune-faq", label: "Frequently asked questions" },
] as const

export const FORTUNE_WHEEL_HOW_IT_WORKS = [
  "Choose a ready-made template or start with the decision wheel.",
  "Add, rename, reorder, enable, or disable as many entries as you need.",
  "Personalize wedge colors, images, result messages, and spin duration.",
  "Spin the wheel and let the pointer select one enabled entry at random.",
  "Keep the winner, remove it for the next round, save the wheel, or share your setup.",
] as const

export const FORTUNE_WHEEL_FEATURES = [
  {
    title: "Unlimited entries",
    description:
      "Build a quick two-choice wheel or add a long list of names, prizes, prompts, and activities.",
  },
  {
    title: "Custom colors",
    description:
      "Give every wedge its own color so choices are clear and the wheel matches your theme.",
  },
  {
    title: "Entry images",
    description:
      "Add an optional image to an entry for visual prize, classroom, or activity wheels.",
  },
  {
    title: "Spin duration",
    description:
      "Adjust how long the wheel spins to create a quick pick or a more dramatic reveal.",
  },
  {
    title: "Remove winners",
    description:
      "Automatically remove selected entries when you need unique winners or elimination rounds.",
  },
  {
    title: "Save wheels",
    description:
      "Keep customized wheels in your browser and return to reusable lessons, games, or routines.",
  },
  {
    title: "Share your setup",
    description:
      "Share a configured wheel so friends, students, or teammates can open the same choices.",
  },
] as const

export const FORTUNE_WHEEL_BENEFITS = [
  "Makes choices visible, fair, and engaging for a group",
  "Turns routine selections into an interactive reveal",
  "Saves setup time with reusable templates",
  "Fits lessons, parties, meetings, chores, and games",
  "Works in modern mobile, tablet, and desktop browsers",
  "Starts free without requiring an account",
] as const

export const FORTUNE_WHEEL_USE_CASES_COPY = [
  {
    title: "Classroom",
    description:
      "Pick a student, reading order, review category, brain break, classroom job, or reward such as extra recess.",
  },
  {
    title: "Parties",
    description:
      "Spin for truth or dare, an icebreaker, a party game, a prize, a gift exchange, or the next song.",
  },
  {
    title: "Business",
    description:
      "Choose meeting order, presentation topics, team activities, giveaway winners, or recognition rewards.",
  },
  {
    title: "Home",
    description:
      "Decide dinner, chores, movie night, weekend activities, family games, or who goes first.",
  },
] as const

export type FortuneWheelComparisonRow = {
  feature: string
  fortuneWheel: string
  randomWheelPicker: string
}

export const FORTUNE_WHEEL_VS_RANDOM_PICKER: FortuneWheelComparisonRow[] = [
  {
    feature: "Best for",
    fortuneWheel: "Themed decisions, games, prizes, lessons, and dramatic reveals",
    randomWheelPicker: "Fast general-purpose random selection",
  },
  {
    feature: "Starting point",
    fortuneWheel: "Fortune-themed presets and evergreen activity templates",
    randomWheelPicker: "A flexible blank wheel for any list",
  },
  {
    feature: "Customization",
    fortuneWheel: "Entries, colors, images, messages, duration, and winner removal",
    randomWheelPicker: "Names or options with standard wheel controls",
  },
  {
    feature: "Typical audience",
    fortuneWheel: "Teachers, party hosts, families, teams, and creators",
    randomWheelPicker: "Anyone who needs a quick random pick",
  },
] 

export const VS_RANDOM_PICKER = FORTUNE_WHEEL_VS_RANDOM_PICKER
export const USE_CASES_COPY = FORTUNE_WHEEL_USE_CASES_COPY

export type FortuneWheelLinkItem = {
  label: string
  href: string
  description: string
}

export const FORTUNE_WHEEL_RELATED_TOOLS: FortuneWheelLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "Create a general-purpose wheel for any list of choices.",
  },
  {
    label: "Prize Wheel Spinner",
    href: "/prize-wheel-spinner",
    description: "Run a prize draw, reward spin, or giveaway.",
  },
  {
    label: "Name Picker Wheel",
    href: "/",
    description: "Pick a person fairly from a list of names.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Randomly divide participants into teams.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Get a quick answer to a two-choice question.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Spin to select a random number.",
  },
  {
    label: "Weighted Wheel Spinner",
    href: "/weighted-wheel-spinner",
    description: "Give choices different chances of being selected.",
  },
]

export const FORTUNE_WHEEL_POPULAR_TEMPLATES: FortuneWheelLinkItem[] = [
  {
    label: "Prize Wheel of Fortune",
    href: "/prize-wheel-of-fortune",
    description: "Spin for rewards, giveaways, and a grand prize.",
  },
  {
    label: "Classroom Wheel of Fortune",
    href: "/classroom-wheel-of-fortune",
    description: "Choose classroom rewards, roles, and activities.",
  },
  {
    label: "Icebreaker Wheel of Fortune",
    href: "/icebreaker-wheel-of-fortune",
    description: "Start conversations with friendly group prompts.",
  },
  {
    label: "Truth or Dare Wheel of Fortune",
    href: "/truth-or-dare-wheel-of-fortune",
    description: "Mix truth, dare, group, and mystery challenges.",
  },
  {
    label: "Custom Wheel of Fortune",
    href: "/custom-wheel-of-fortune",
    description: "Start simple and replace every option with your own.",
  },
  {
    label: "Holiday Wheel of Fortune",
    href: "/holiday-wheel-of-fortune",
    description: "Pick festive activities, treats, and gift ideas.",
  },
  {
    label: "Game Night Wheel of Fortune",
    href: "/game-night-wheel-of-fortune",
    description: "Choose the next game, challenge, or wild card.",
  },
  {
    label: "Giveaway Wheel",
    href: "/prize-wheel-of-fortune",
    description: "Create an engaging giveaway or promotional prize spin.",
  },
  {
    label: "Jess Coleman Wheel Picker",
    href: "/jess-coleman-wheel-of-fortune",
    description: "Open a customizable template inspired by trending search interest.",
  },
  {
    label: "Trending: Rainey Dorbor",
    href: "/rainey-dorbor-wheel-of-fortune",
    description: "Try a ready-made wheel inspired by trending search interest.",
  },
]

export const FORTUNE_WHEEL_FAQ_ITEMS = [
  {
    question: "What is the Wheel of Fortune online spinner?",
    answer:
      "It is a free independent wheel tool that randomly selects from choices you add. Use it for decisions, games, prizes, classroom activities, and group prompts.",
  },
  {
    question: "Is this the official Wheel of Fortune TV show website?",
    answer:
      "No. This independent online tool is not affiliated with or endorsed by the Wheel of Fortune television show, Sony, or CBS.",
  },
  {
    question: "Can I make my own Wheel of Fortune?",
    answer:
      "Yes. Add your own entries, choose colors, attach images, write result messages, and adjust the spin duration.",
  },
  {
    question: "Is the fortune wheel free?",
    answer:
      "Yes. You can create and spin a wheel for free without creating an account.",
  },
  {
    question: "Are all entries equally likely to win?",
    answer:
      "Enabled entries use equal-sized wedges in this tool. Use the weighted wheel when choices need different probabilities.",
  },
  {
    question: "Can I remove a winner after each spin?",
    answer:
      "Yes. Turn on winner removal for giveaways, classroom turns, and elimination-style activities.",
  },
  {
    question: "Can I save and reuse a wheel?",
    answer:
      "Yes. Save your setup in the browser so recurring lessons, meetings, chores, or games are ready next time.",
  },
  {
    question: "What can teachers put on the wheel?",
    answer:
      "Teachers can add student names, review topics, reading turns, classroom jobs, brain breaks, and suitable rewards.",
  },
  {
    question: "Can I use this wheel for prizes or giveaways?",
    answer:
      "Yes. Add prize labels or participant names, explain the rules before spinning, and remove winners when each prize needs a unique recipient.",
  },
  {
    question: "Does the wheel work on phones and tablets?",
    answer:
      "Yes. It works in modern mobile, tablet, and desktop browsers.",
  },
] as const
