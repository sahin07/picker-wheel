import { HOME_SITE_URL } from "@/lib/home-seo"

export const DATE_PICKER_SITE_URL = HOME_SITE_URL

export const DATE_PICKER_PATH = "/date-picker-wheel"

export const DATE_PICKER_URL = `${DATE_PICKER_SITE_URL}${DATE_PICKER_PATH}`

export const DATE_PICKER_PAGE_TITLE = "Date Picker Wheel | Spin a Random Date Online"

export const DATE_PICKER_PAGE_DESCRIPTION =
  "Spin the Date Picker Wheel to pick a random date online. Choose single dates or ranges, filter weekdays, customize formats, and make fair date selections for challenges, meetings, workouts, and games."

export const DATE_PICKER_H1 = "Date Picker Wheel"

export const DATE_PICKER_SHORT_TITLE = "Date Picker Wheel"

export const DATE_PICKER_HERO_INTRO =
  "Need a fair random date instead of flipping a calendar yourself? Our Date Picker Wheel lets you add single dates or date ranges, filter by weekday, spin a customizable wheel, and land on a date everyone can see. Perfect for 30-day challenges, meeting picks, workout schedules, classroom activities, and fun planning games."

export const DATE_PICKER_KEYWORDS = [
  "date picker wheel",
  "random date picker",
  "date wheel",
  "pick random date",
  "random date generator",
  "spin a date",
  "date spinner",
  "random day picker",
  "calendar wheel",
  "date selection wheel",
  "random date online",
  "pick a random day",
] as const

export const DATE_PICKER_ON_THIS_PAGE = [
  { id: "dp-popular", label: "Popular date wheels" },
  { id: "dp-spin-wheel", label: "Spin a date wheel" },
  { id: "dp-ranges", label: "Pick dates and ranges" },
  { id: "dp-weekdays", label: "Filter by weekday" },
  { id: "dp-use-cases", label: "Common ways to use a date picker wheel" },
  { id: "dp-why", label: "Why use a date wheel" },
  { id: "dp-related", label: "Related tools" },
  { id: "dp-faq", label: "FAQ" },
] as const

export type DatePickerLinkItem = {
  label: string
  href: string
  description: string
}

export const DATE_PICKER_POPULAR_WHEELS: DatePickerLinkItem[] = [
  {
    label: "Next 7 Days",
    href: DATE_PICKER_PATH,
    description: "Spin among the next week of dates for quick plans.",
  },
  {
    label: "Next 30 Days",
    href: "/random-date-wheel",
    description: "A month of upcoming dates for challenges and scheduling.",
  },
  {
    label: "Workdays Only",
    href: "/workday-date-wheel",
    description: "Monday–Friday dates for meetings and office plans.",
  },
  {
    label: "Weekends Only",
    href: "/weekend-date-wheel",
    description: "Saturday and Sunday picks for fun and family plans.",
  },
  {
    label: "This Month",
    href: DATE_PICKER_PATH,
    description: "Remaining days in the current month.",
  },
  {
    label: "30-Day Challenge",
    href: "/30-day-challenge-wheel",
    description: "Spin a date inside your 30-day challenge window.",
  },
]

export const DATE_PICKER_RANGE_POINTS = [
  {
    title: "Add single dates",
    description:
      "Tap individual days on the calendar when you only need a short list of candidates.",
  },
  {
    title: "Add date ranges",
    description:
      "Select a start and end date to fill the wheel with every day in between—ideal for challenges and monthly plans.",
  },
  {
    title: "Choose a date format",
    description:
      "Display results as 30/10/2022, October 30, 2022, or with the weekday included so announcements stay clear.",
  },
  {
    title: "Elimination mode",
    description:
      "Remove winning dates after each spin when you want every day used only once.",
  },
] as const

export const DATE_PICKER_WEEKDAY_POINTS = [
  {
    title: "Workdays",
    description: "Keep Monday–Friday enabled for meeting schedules and office challenges.",
  },
  {
    title: "Weekends",
    description: "Limit the wheel to Saturday and Sunday for leisure plans and family activities.",
  },
  {
    title: "Custom day mix",
    description: "Toggle any combination of weekdays so only the days you care about stay on the spinner.",
  },
] as const

export type DatePickerUseCaseGroup = {
  title: string
  items: readonly { title: string; description: string; href: string }[]
}

export const DATE_PICKER_USE_CASE_GROUPS: DatePickerUseCaseGroup[] = [
  {
    title: "Challenges & habits",
    items: [
      {
        title: "30-day challenges",
        href: "/30-day-challenge-wheel",
        description: "Spin which day of your challenge gets a bonus task or check-in.",
      },
      {
        title: "Workout days",
        href: "/workday-date-wheel",
        description: "Pick random training dates inside a workweek or custom range.",
      },
      {
        title: "Habit streaks",
        href: DATE_PICKER_PATH,
        description: "Choose the next habit day fairly when the schedule feels stuck.",
      },
    ],
  },
  {
    title: "Planning & meetings",
    items: [
      {
        title: "Meeting dates",
        href: "/workday-date-wheel",
        description: "Spin among available workdays when the team cannot decide.",
      },
      {
        title: "Event planning",
        href: "/random-date-wheel",
        description: "Pick a random day in the next month for parties or launches.",
      },
      {
        title: "Weekend plans",
        href: "/weekend-date-wheel",
        description: "Let the wheel choose the next Saturday or Sunday outing.",
      },
    ],
  },
  {
    title: "Games & classrooms",
    items: [
      {
        title: "Classroom activities",
        href: DATE_PICKER_PATH,
        description: "Spin a date for history timelines, journal prompts, or project due fun.",
      },
      {
        title: "Party games",
        href: DATE_PICKER_PATH,
        description: "Use random dates as trivia answers, scavenger clues, or dare days.",
      },
      {
        title: "Giveaways",
        href: DATE_PICKER_PATH,
        description: "Pick a fair winner date for contests that need a calendar day, not a name.",
      },
    ],
  },
] as const

export const DATE_PICKER_WHY_POINTS = [
  {
    title: "Fair and visible",
    description: "Everyone watches the same spin, so the chosen date feels unbiased.",
  },
  {
    title: "Faster than scrolling calendars",
    description: "Load a range once, then spin instead of debating every day manually.",
  },
  {
    title: "Weekday control",
    description: "Filter weekends or weekdays so results always match your real schedule.",
  },
  {
    title: "Great for challenges",
    description: "30-day and habit challenges need random day picks without spreadsheet fuss.",
  },
] as const

export const DATE_PICKER_RELATED_TOOLS: DatePickerLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The main spinner for any custom list of options.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Spin numbers for ranges, bingo, and dice-style rolls.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "A simple decision wheel for binary choices.",
  },
  {
    label: "Random Letter Picker",
    href: "/random-letter-picker",
    description: "Spin the alphabet wheel for games and learning.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Spin a random color for games and classrooms.",
  },
  {
    label: "Image Picker Wheel",
    href: "/image-picker-wheel",
    description: "Spin pictures and photos for visual selections.",
  },
  {
    label: "Team / Name Picker",
    href: "/team-picker-wheel",
    description: "Spin names and teams for classrooms and groups.",
  },
]

export const DATE_PICKER_CLUSTER_LINKS: DatePickerLinkItem[] = [
  { label: "Random Date Wheel", href: "/random-date-wheel", description: "" },
  { label: "30-Day Challenge Wheel", href: "/30-day-challenge-wheel", description: "" },
  { label: "Workday Date Wheel", href: "/workday-date-wheel", description: "" },
  { label: "Weekend Date Wheel", href: "/weekend-date-wheel", description: "" },
]

export const DATE_PICKER_ARTICLE_TITLE = "Spin a Date Wheel"

export const DATE_PICKER_ARTICLE_INTRO = [
  "A Date Picker Wheel is a spinning calendar chooser for random date selection. Add single dates or a range, filter which weekdays count, spin the wheel, and land on a fair day for challenges, meetings, workouts, classrooms, and planning games.",
  "Unlike a booking calendar that finds open slots, this tool randomly chooses among the dates you enable. Unlike a number wheel, every slice is a real calendar day you can announce in your preferred format.",
  "Start by tapping a Popular Date Wheels template under the title—Next 7 Days, Next 30 Days, Workdays, Weekends, This Month, or a 30-Day Challenge—or build a custom list with the calendar controls.",
] as const

export const DATE_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Date Picker Wheel?",
    answer:
      "A Date Picker Wheel is an online date spinner that randomly selects a day from the dates you add. It is a visual random date picker for challenges, meetings, workouts, and games.",
  },
  {
    question: "Can I pick a random date in a range?",
    answer:
      "Yes. Select a start and end date to fill the wheel with every day in that range, then spin for a fair pick.",
  },
  {
    question: "Can I exclude weekends?",
    answer:
      "Yes. Use the weekday filters to turn Saturday and Sunday off, or load the Workdays Only template to keep Monday–Friday.",
  },
  {
    question: "Can I spin weekends only?",
    answer:
      "Yes. Enable only Saturday and Sunday, or open the Weekend Date Wheel template for leisure planning.",
  },
  {
    question: "What date formats are supported?",
    answer:
      "You can display dates in common formats such as 30/10/2022, October 30, 2022, or with the weekday name included.",
  },
  {
    question: "Does every date have an equal chance?",
    answer:
      "Yes. Each enabled date on the wheel has an equal chance of being selected. Use elimination mode if you want winners removed after each spin.",
  },
  {
    question: "Can I save my date wheel?",
    answer:
      "Yes. Use My Wheels to keep custom date setups on this device and switch between them later.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. You can add dates, filter weekdays, and spin a random date online for free.",
  },
] as const
