import { HOME_SITE_URL } from "@/lib/home-seo"

export const NUMBER_PICKER_SITE_URL = HOME_SITE_URL

export const NUMBER_PICKER_PATH = "/number-picker-wheel"

export const NUMBER_PICKER_URL = `${NUMBER_PICKER_SITE_URL}${NUMBER_PICKER_PATH}`

export const NUMBER_PICKER_PAGE_TITLE =
  "Random Number Picker Wheel | Spin a Random Number Online"

export const NUMBER_PICKER_PAGE_DESCRIPTION =
  "Spin our free Random Number Picker Wheel to choose numbers instantly. Create a custom number wheel, generate random numbers, customize ranges, and make fair selections in seconds."

export const NUMBER_PICKER_H1 = "Random Number Picker Wheel"

/** Short chrome title above the tool (not the SEO H1). */
export const NUMBER_PICKER_SHORT_TITLE = "Number Picker Wheel"

export const NUMBER_PICKER_HERO_INTRO =
  "Need to pick a random number without bias? Enter your own numbers or create a custom range, then spin the Random Number Picker Wheel to instantly select a winner. Whether you're choosing lucky numbers, running classroom activities, organizing games, giveaways, or making everyday decisions, our free number spinner provides a quick and fair way to generate random results."

export const NUMBER_PICKER_KEYWORDS = [
  "random number picker wheel",
  "random number picker",
  "number picker wheel",
  "random number generator",
  "wheel spinner",
  "random wheel picker",
  "random picker wheel",
  "spinner wheel picker",
  "random wheel generator",
  "spin the wheel",
  "pick a random number",
  "number spinner",
  "lucky number picker",
  "random choice",
  "random selection",
  "choose a number",
  "spinning wheel",
  "wheel of numbers",
  "number selector",
] as const

export const NUMBER_PICKER_ON_THIS_PAGE = [
  { id: "np-popular-wheels", label: "Popular number wheels" },
  { id: "np-spin-random", label: "Spin a random number" },
  { id: "np-create-wheel", label: "Create your number wheel" },
  { id: "np-use-cases", label: "Common ways to use" },
  { id: "np-why", label: "Why use a number picker wheel" },
  { id: "np-vs-rng", label: "Wheel vs generator" },
  { id: "np-related", label: "Related tools" },
  { id: "np-faq", label: "FAQ" },
] as const

export type NumberPickerLinkItem = {
  label: string
  href: string
  description: string
}

/** Popular ranges / modes — phase-1 spokes use dedicated routes; others stay query deep links */
export const NUMBER_PICKER_POPULAR_WHEELS: NumberPickerLinkItem[] = [
  {
    label: "1–10 Number Wheel",
    href: "/number-wheel-1-to-10",
    description: "Quick spins for small groups, board games, and classroom picks.",
  },
  {
    label: "1–20 Number Wheel",
    href: `${NUMBER_PICKER_PATH}?min=1&max=20`,
    description: "A mid-size range for fitness challenges and practice drills.",
  },
  {
    label: "1–50 Number Wheel",
    href: `${NUMBER_PICKER_PATH}?min=1&max=50`,
    description: "Great for ticket-style draws and larger classroom lists.",
  },
  {
    label: "1–100 Number Wheel",
    href: "/number-wheel-1-to-100",
    description: "Classic hundred-number spinner for games and lucky picks.",
  },
  {
    label: "1–1000 Number Wheel",
    href: `${NUMBER_PICKER_PATH}?min=1&max=1000&interval=10`,
    description: "Broad selection using a step of 10 so the wheel stays fast and readable.",
  },
  {
    label: "Prize Number Wheel",
    href: `${NUMBER_PICKER_PATH}?preset=prize-drawings`,
    description: "Eliminate winning tickets for classroom or party prize draws.",
  },
  {
    label: "Bingo Number Wheel",
    href: "/bingo-number-wheel",
    description: "Call bingo numbers from 1–75 with classic B-I-N-G-O letters.",
  },
  {
    label: "Lottery Number Picker",
    href: "/lottery-number-picker",
    description: "Spin lottery-style balls 1–59 with elimination for practice tickets.",
  },
  {
    label: "Lucky Number Wheel",
    href: `${NUMBER_PICKER_PATH}?preset=lucky-number`,
    description: "Spin a playful lucky number for icebreakers and party games.",
  },
  {
    label: "Even Numbers Wheel",
    href: `${NUMBER_PICKER_PATH}?min=2&max=100&interval=2`,
    description: "Only even numbers—handy for math warm-ups and pattern drills.",
  },
  {
    label: "Odd Numbers Wheel",
    href: `${NUMBER_PICKER_PATH}?min=1&max=99&interval=2`,
    description: "Only odd numbers for practice games and number activities.",
  },
]

export const NUMBER_PICKER_CREATE_POINTS = [
  {
    title: "Add numbers",
    description:
      "Build a list from a min–max range, paste values in the Text tab, or load a use-case mode from the strip above the wheel.",
  },
  {
    title: "Remove numbers",
    description:
      "Exclude values you do not want, clear results, or turn on elimination so each winner leaves the wheel after a spin.",
  },
  {
    title: "Set custom ranges",
    description:
      "Choose any start and end value, set an interval (step), and regenerate the wheel of numbers in one click.",
  },
  {
    title: "Edit titles and labels",
    description:
      "Customize the tool title, description, and result title so classrooms, parties, and streams see clear copy.",
  },
  {
    title: "Customize colors",
    description:
      "Pick Style palettes or Themes so your number spinner matches the vibe of the activity.",
  },
] as const

export const NUMBER_PICKER_USE_CASES_SEO = [
  {
    title: "Classroom number selection",
    description:
      "Call on student numbers fairly for questions, helpers, or presentation order—visible to the whole class.",
  },
  {
    title: "Prize drawings",
    description:
      "Spin ticket numbers for classroom or party giveaways and remove winners so draws stay fair.",
  },
  {
    title: "Bingo games",
    description:
      "Call numbers from 1–75 with B-I-N-G-O style results for party nights and classroom games.",
  },
  {
    title: "Fitness challenges",
    description:
      "Spin reps, rounds, or challenge levels when you want a random workout prompt.",
  },
  {
    title: "Board games",
    description:
      "Replace a missing die with a 1–6 spin for moves and turns.",
  },
  {
    title: "Team assignments",
    description:
      "Assign people to team IDs by spinning a small set of team numbers.",
  },
  {
    title: "Random seating",
    description:
      "Hand out seat numbers without repeats for events, rooms, and classrooms.",
  },
  {
    title: "Math activities",
    description:
      "Spin a number, then solve the practice problem it unlocks for warm-ups and drills.",
  },
  {
    title: "Lucky number games",
    description:
      "Pick a playful lucky number for icebreakers, streams, and family games.",
  },
  {
    title: "Fortune number fun",
    description:
      "Spin an entertainment fortune number with a lighthearted blurb—clearly for fun only.",
  },
] as const

export const NUMBER_PICKER_WHY_POINTS = [
  {
    title: "Visual selection",
    description:
      "Everyone sees the same spinning wheel of numbers and the same result—no hidden RNG screen.",
  },
  {
    title: "Fun for groups",
    description:
      "The spin builds anticipation in classrooms, parties, and streams where an instant digit feels flat.",
  },
  {
    title: "Fair random choice",
    description:
      "Equal weights (or custom weights) keep picks transparent; elimination mode prevents repeats when you need them.",
  },
  {
    title: "Easy customization",
    description:
      "Change ranges, steps, colors, titles, and modes without installing an app.",
  },
  {
    title: "Mobile friendly",
    description:
      "Use the number picker wheel on phone, tablet, or desktop for on-the-spot decisions.",
  },
  {
    title: "No signup required",
    description:
      "Open the page and spin. Keep wheels in My Wheels on this device when you want to reopen a setup later.",
  },
] as const

export const NUMBER_PICKER_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Visual spinning wheel everyone can watch",
    generator: "Instant generation with minimal UI",
  },
  {
    aspect: "Best for",
    wheel: "Groups, classrooms, games, and live draws",
    generator: "Quick personal results and calculations",
  },
  {
    aspect: "Engagement",
    wheel: "Fun, interactive, builds anticipation",
    generator: "Fast and utilitarian",
  },
  {
    aspect: "Customization",
    wheel: "Ranges, colors, modes, elimination, titles",
    generator: "Usually min/max only",
  },
  {
    aspect: "Fairness feel",
    wheel: "Shared visual proof of the random pick",
    generator: "Trusted for speed, less theatrical",
  },
] as const

export const NUMBER_PICKER_RELATED_TOOLS: NumberPickerLinkItem[] = [
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin names for classrooms, giveaways, and decisions.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Pick a random letter for word games and prompts.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-no-picker-wheel",
    description: "A simple decision wheel for binary choices.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Spin for a random color for design and art challenges.",
  },
  {
    label: "Team Picker",
    href: "/team-picker",
    description: "Split people into random teams for sports and class.",
  },
  {
    label: "Image Picker",
    href: "/image-picker-wheel",
    description: "Spin photos and images for visual random choices.",
  },
  {
    label: "Date Picker Wheel",
    href: "/date-picker-wheel",
    description: "Pick a random date for planning and games.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable custom spin wheel for any list.",
  },
]

export const NUMBER_PICKER_ARTICLE_TITLE =
  "Random Number Picker Wheel: Spin to Choose a Number Online"

export const NUMBER_PICKER_ARTICLE_INTRO = [
  "A Random Number Picker Wheel turns a range of numbers into an interactive spinning wheel. Instead of generating a quiet digit in a form field, you spin a wheel of numbers so classmates, friends, or viewers can see the selection happen live.",
  "This page is a free number spinner and random number generator in one visual tool. Set a custom range, exclude values, weight slices when needed, and spin for a fair random selection—ideal when you want both randomness and a shared experience.",
  "Use it as a lucky number picker, classroom number selector, bingo caller, fitness challenge spinner, or everyday random choice tool. Keep name lists, color wheels, and other topics on their dedicated pages; this tool stays focused on numbers.",
] as const

export const NUMBER_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Random Number Picker Wheel?",
    answer:
      "A Random Number Picker Wheel is an online spinning wheel that selects a number at random from a list or range you define. You spin the wheel to pick a random number for games, classrooms, giveaways, and everyday decisions.",
  },
  {
    question: "Is every number equally likely to be selected?",
    answer:
      "Yes—when each number has the same weight, every enabled slice has an equal chance. You can also adjust weights in the Text tab if you intentionally want uneven odds.",
  },
  {
    question: "Can I create my own number range?",
    answer:
      "Yes. Set a minimum, maximum, and optional interval (step) to build a custom number wheel—such as 1–10, 1–100, even numbers only, or any range that fits your activity.",
  },
  {
    question: "Can I remove numbers after each spin?",
    answer:
      "Yes. Use elimination mode (or Remove winner in Manage) so each selected number leaves the wheel. That is useful for prize drawings, seating, bingo calls, and classroom turns without repeats.",
  },
  {
    question: "What's the difference between a number wheel and a random number generator?",
    answer:
      "A random number generator usually returns an instant digit with a simple interface. A number picker wheel shows a visual spin, which is better for groups, classrooms, and live draws. Both can produce fair random numbers; the wheel adds interaction and shared visibility.",
  },
  {
    question: "Can I use it for classroom activities?",
    answer:
      "Absolutely. Teachers use the Random Number Picker Wheel for student numbers, helpers, presentation order, math warm-ups, and game-based learning. The spin is visible to the whole class.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The number spinner is mobile-friendly, so you can spin a random number on phones, tablets, and desktops without installing an app.",
  },
  {
    question: "Can I save my custom wheel?",
    answer:
      "Yes. Use My Wheels to keep number wheels on this device so you can reopen a saved range, mode, or title later. No account is required to start spinning.",
  },
] as const
