import { HOME_SITE_URL } from "@/lib/home-seo"

export const PRIZE_WHEEL_SITE_URL = HOME_SITE_URL
export const PRIZE_WHEEL_PATH = "/prize-wheel-spinner"
export const PRIZE_WHEEL_URL = `${PRIZE_WHEEL_SITE_URL}${PRIZE_WHEEL_PATH}`
export const PRIZE_WHEEL_OG_IMAGE_URL = `${PRIZE_WHEEL_SITE_URL}/og/prize-wheel-spinner.svg`

export const PRIZE_WHEEL_SHORT_TITLE = "Prize Wheel Spinner"
export const PRIZE_WHEEL_PAGE_TITLE =
  "Prize Wheel Spinner | Create a Free Spin to Win Wheel"
export const PRIZE_WHEEL_H1 = "Prize Wheel Spinner"
export const PRIZE_WHEEL_PAGE_DESCRIPTION =
  "Create a customizable Prize Wheel Spinner for giveaways, events, classrooms, promotions, and contests. Add prizes, spin the wheel, choose winners fairly, and share your custom wheel online for free."

export const PRIZE_WHEEL_HERO_INTRO =
  "Make every giveaway more exciting with our Prize Wheel Spinner. Add your own prizes, customize the wheel, and spin to randomly select a winner in seconds. Whether you're running a classroom reward system, a trade show booth, a birthday party, or an online promotion, this free prize wheel helps create a fun and transparent experience for everyone."

export const PRIZE_WHEEL_DISCLAIMER =
  "For public contests, clearly publish the prize list and participation rules before spinning. This Prize Wheel uses equal odds for every enabled prize, helping hosts run a transparent promotion that participants can understand."

export const PRIZE_WHEEL_FAIRNESS_NOTE = {
  text: "Every enabled prize has an equal chance of being selected. If your activity needs intentionally different probabilities, use the Weighted Wheel and disclose the configured percentages to participants.",
  href: "/weighted-wheel-spinner",
  label: "Weighted Wheel",
} as const

export const PRIZE_WHEEL_KEYWORDS = [
  "prize wheel spinner",
  "prize wheel",
  "spin to win wheel",
  "prize wheel online",
  "prize wheel generator",
  "prize picker wheel",
  "spin the prize wheel",
  "prize spinner",
  "wheel of prizes",
  "prize wheel maker",
  "random prize picker",
  "giveaway prize wheel",
  "promotional prize wheel",
  "raffle prize wheel",
  "lucky draw wheel",
  "reward wheel",
  "spin to win game",
  "contest prize wheel",
  "lucky wheel",
  "reward spinner",
  "discount wheel",
  "coupon wheel",
  "classroom reward wheel",
  "trade show prize wheel",
  "birthday prize wheel",
  "customer reward wheel",
  "fundraising prize wheel",
] as const

export const PRIZE_WHEEL_ON_THIS_PAGE = [
  { id: "prize-spin-wheel", label: "Spin the Prize Wheel" },
  { id: "prize-how-it-works", label: "How the Prize Wheel works" },
  { id: "prize-features", label: "Create your own Prize Wheel" },
  { id: "prize-templates", label: "Popular prize templates" },
  { id: "prize-use-cases", label: "Common ways to use a Prize Wheel" },
  { id: "prize-why", label: "Why use a Prize Wheel Spinner" },
  { id: "prize-vs-name-picker", label: "Prize Wheel vs Name Picker" },
  { id: "prize-fairness", label: "Fairness and transparency" },
  { id: "prize-related", label: "Related tools" },
  { id: "prize-faq", label: "FAQ" },
] as const

export const PRIZE_WHEEL_BENEFITS = [
  "Makes giveaways more engaging for participants",
  "Creates a transparent, visible selection process",
  "Easy to customize with prizes, colors, images, and messages",
  "Works on phones, tablets, and desktops",
  "No signup required to start spinning",
  "Free to use for classrooms, events, and promotions",
] as const

export const PRIZE_WHEEL_HOW_IT_WORKS = [
  "Add each prize in the Inputs panel and give it a clear name.",
  "Personalize prizes with optional images, colors, and winning messages.",
  "Disable any unavailable prize or choose to remove a prize after it is won.",
  "Spin the wheel to select one enabled prize at random with equal chance.",
  "Save the wheel in your browser or share the setup for your event or promotion.",
] as const

export const PRIZE_WHEEL_FEATURES = [
  {
    title: "Custom prizes",
    description: "Add, rename, reorder, enable, or disable prizes to match any activity.",
  },
  {
    title: "Prize images",
    description: "Add an image to help products, rewards, and branded gifts stand out.",
  },
  {
    title: "Custom colors",
    description: "Choose a color for each prize and create a wheel that fits your theme.",
  },
  {
    title: "Winning messages",
    description: "Show a custom celebration or redemption instruction for every result.",
  },
  {
    title: "Remove after won",
    description: "Remove a selected prize from later spins when each item is available once.",
  },
  {
    title: "Save locally",
    description: "Keep your prize setup in this browser so it is ready for the next session.",
  },
  {
    title: "Easy sharing",
    description: "Share your configured wheel with teammates, teachers, or event hosts.",
  },
] as const

export const PRIZE_WHEEL_USE_CASES_COPY = [
  {
    title: "Giveaways",
    description:
      "Run social media contests, YouTube giveaways, Twitch streams, and community events with a clear prize list and equal-chance spins.",
  },
  {
    title: "Business Promotions",
    description:
      "Use spin-to-win discounts, customer rewards, trade show booths, store promotions, and loyalty programs to boost engagement.",
  },
  {
    title: "Classroom",
    description:
      "Reward homework effort, positive behavior, reading challenges, and participation with stickers, passes, and mystery prizes.",
  },
  {
    title: "Parties & Events",
    description:
      "Add birthday games, baby showers, family game night, holiday parties, and fundraising activities to the celebration.",
  },
] as const

export const PRIZE_WHEEL_VS_NAME_PICKER = [
  {
    aspect: "What goes on the wheel",
    prizeWheel: "Prizes, rewards, discounts, gifts, or experiences.",
    namePicker: "People, participants, students, or team members.",
  },
  {
    aspect: "What the result means",
    prizeWheel: "Selects which prize or reward is awarded.",
    namePicker: "Selects which person is chosen.",
  },
  {
    aspect: "Best for",
    prizeWheel: "Promotions, classroom rewards, parties, and event activities.",
    namePicker: "Giveaway entrants, classroom participation, speakers, and team selection.",
  },
  {
    aspect: "Customization",
    prizeWheel: "Prize images, colors, and prize-specific winning messages.",
    namePicker: "Names, participant lists, and general picker styling.",
  },
  {
    aspect: "After a result",
    prizeWheel: "Optionally remove a prize after it has been won.",
    namePicker: "Optionally remove a selected person from future picks.",
  },
] as const

export type PrizeWheelLinkItem = {
  label: string
  href: string
  description: string
}

export const PRIZE_WHEEL_RELATED_TOOLS: PrizeWheelLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The classic multi-purpose picker wheel for names and options.",
  },
  {
    label: "Giveaway Picker",
    href: "/giveaway-name-picker",
    description: "Pick a giveaway recipient from your participant list.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Choose a person fairly from a list of names.",
  },
  {
    label: "Rigged / Weighted Wheel Spinner",
    href: "/weighted-wheel-spinner",
    description: "Assign transparent custom probabilities when equal odds are not enough.",
  },
  {
    label: "The Wheel of Fortune",
    href: "/wheel-of-fortune",
    description: "Create a customizable fortune-themed wheel for parties, classrooms, and decisions.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Divide participants into random teams.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Select a random number with a visual spin.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Make a quick two-option decision.",
  },
]

export const PRIZE_WHEEL_POPULAR_TEMPLATES: PrizeWheelLinkItem[] = [
  {
    label: "Giveaway Prize Wheel",
    href: "/giveaway-prize-wheel",
    description: "For content creators and community contests.",
  },
  {
    label: "Spin to Win Discounts",
    href: "/discount-wheel",
    description: "For businesses running promotional offers.",
  },
  {
    label: "Classroom Reward Wheel",
    href: "/classroom-reward-wheel",
    description: "For teachers and positive classroom incentives.",
  },
  {
    label: "Birthday Prize Wheel",
    href: "/birthday-prize-wheel",
    description: "For families and party games.",
  },
  {
    label: "Trade Show Prize Wheel",
    href: "/trade-show-prize-wheel",
    description: "For exhibitors and booth engagement.",
  },
  {
    label: "Holiday Gift Wheel",
    href: "/holiday-prize-wheel",
    description: "For seasonal events and celebrations.",
  },
  {
    label: "Office Rewards Wheel",
    href: "/reward-wheel",
    description: "For companies and team appreciation.",
  },
  {
    label: "Fundraising Prize Wheel",
    href: "/fundraising-wheel",
    description: "For nonprofits and donor thank-yous.",
  },
  {
    label: "Customer Loyalty Wheel",
    href: "/customer-reward-wheel",
    description: "For retailers and repeat customers.",
  },
  {
    label: "Twitch Giveaway Wheel",
    href: "/giveaway-prize-wheel",
    description: "For streamers and live audience rewards.",
  },
]

export const PRIZE_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a Prize Wheel Spinner?",
    answer:
      "A Prize Wheel Spinner is a free online tool that randomly selects a prize from your custom list. Add rewards, customize colors and images, then spin to choose a winner fairly for giveaways, classrooms, promotions, and events.",
  },
  {
    question: "Can I add my own prizes?",
    answer:
      "Yes. Add, rename, reorder, enable, or disable entries to match your inventory, budget, and audience.",
  },
  {
    question: "Can I upload prize images?",
    answer:
      "Yes. Each prize can include an optional image so products and branded gifts are easy to recognize on screen.",
  },
  {
    question: "Can I remove prizes after they're won?",
    answer:
      "Yes. Use elimination / remove-after-win mode when each prize should be awarded only once. Remaining prizes stay equally likely.",
  },
  {
    question: "Is every prize equally likely to be selected?",
    answer:
      "Yes. Every enabled prize on this spinner has an equal chance. Disabled prizes are excluded from the spin.",
  },
  {
    question: "Can I create different prize probabilities?",
    answer:
      "This Prize Wheel Spinner is equal-odds by design for transparent giveaways. For intentional unequal odds, use the Weighted Wheel Spinner and disclose those percentages to participants.",
  },
  {
    question: "Can I save my custom prize wheel?",
    answer:
      "Yes. Your setup can be saved locally in your browser so it is ready for the next class, booth, or stream.",
  },
  {
    question: "Can I share my prize wheel with others?",
    answer:
      "Yes. Share your configured wheel with co-hosts, teachers, or teammates so everyone can run the same prize list.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The Prize Wheel Spinner works in modern mobile and desktop browsers, so you can host from a phone, tablet, or laptop.",
  },
  {
    question: "Is the Prize Wheel Spinner free?",
    answer:
      "Yes. You can create, customize, and spin a prize wheel online without paying or creating an account.",
  },
] as const
