import { HOME_SITE_URL } from "@/lib/home-seo"

export const RAFFLE_SPIN_WHEEL_SITE_URL = HOME_SITE_URL
export const RAFFLE_SPIN_WHEEL_PATH = "/raffle-spin-wheel"
export const RAFFLE_SPIN_WHEEL_URL = `${RAFFLE_SPIN_WHEEL_SITE_URL}${RAFFLE_SPIN_WHEEL_PATH}`
export const RAFFLE_SPIN_WHEEL_OG_IMAGE_URL = `${RAFFLE_SPIN_WHEEL_SITE_URL}/og/raffle-spin-wheel.svg`

export const RAFFLE_SPIN_WHEEL_SHORT_TITLE = "Raffle Spin Wheel"
export const RAFFLE_SPIN_WHEEL_PAGE_TITLE =
  "Raffle Spin Wheel | Free Random Raffle Winner Picker"
export const RAFFLE_SPIN_WHEEL_H1 = "Raffle Spin Wheel"
export const RAFFLE_SPIN_WHEEL_PAGE_DESCRIPTION =
  "Run a fair raffle draw online. Paste participants, spin for a random winner, remove winners after each draw, and keep a clear draw history—free, no signup."

export const RAFFLE_SPIN_WHEEL_HERO_INTRO =
  "Use the Raffle Spin Wheel when you need a transparent participant draw: enter names or ticket holders, spin once, announce the winner, then optionally remove them and continue. Built for contests, stream giveaways, classroom ticket draws, and charity raffles—not for spinning prize labels."

export const RAFFLE_SPIN_WHEEL_DISCLAIMER =
  "For public contests, publish your rules and eligibility before spinning. Keep every enabled entry visible to participants when equal odds are required. Follow the laws and platform rules that apply where you run the raffle."

export const RAFFLE_SPIN_WHEEL_KEYWORDS = [
  "raffle spin wheel",
  "raffle wheel",
  "raffle picker",
  "raffle winner picker",
  "random raffle picker",
  "raffle generator",
  "random winner generator",
  "raffle spinner",
  "online raffle draw",
  "random draw generator",
  "winner picker",
  "contest winner picker",
  "lucky draw wheel",
  "random drawing wheel",
] as const

export const RAFFLE_SPIN_WHEEL_ON_THIS_PAGE = [
  { id: "raffle-spin-wheel", label: "Spin the Raffle Wheel" },
  { id: "raffle-how-it-works", label: "How a raffle draw works" },
  { id: "raffle-features", label: "Raffle features" },
  { id: "raffle-templates", label: "Popular raffle setups" },
  { id: "raffle-vs-prize", label: "Raffle vs Prize Wheel" },
  { id: "raffle-fairness", label: "Fairness tips" },
  { id: "raffle-related", label: "Related tools" },
  { id: "raffle-faq", label: "FAQ" },
] as const

export const RAFFLE_SPIN_WHEEL_HOW_IT_WORKS = [
  "Add each participant (or paste a full entrant list in the Text tab).",
  "Confirm weights or duplicate lines if someone has extra tickets.",
  "Spin the wheel so everyone can see the random draw.",
  "Optionally remove the winner and keep drawing for more prizes.",
] as const

export const RAFFLE_SPIN_WHEEL_FEATURES = [
  {
    title: "Elimination draws",
    description: "Remove each winner automatically so later draws stay fair.",
  },
  {
    title: "Multi-winner draws",
    description: "Draw 1, 3, 5, or 10 winners in one go with locked history.",
  },
  {
    title: "Lock winners",
    description: "Keep drawn names out of the pool so they cannot be selected again.",
  },
  {
    title: "Custom prize places",
    description: "Map 1st / 2nd / 3rd (and more) prize labels onto each draw.",
  },
  {
    title: "Final winner screen",
    description: "Celebrate each draw with name, prize label, and timestamp.",
  },
  {
    title: "Weighted tickets",
    description: "Give more chances with duplicate names or higher weights.",
  },
  {
    title: "Draw history",
    description: "Review Draw #N → name → prize for the whole raffle.",
  },
  {
    title: "Share results",
    description: "Create a link that shows the recorded draw order without reopening the entrant list.",
  },
  {
    title: "Ticket tools",
    description: "Generate Ticket 01–N or expand weights into visible duplicate tickets.",
  },
  {
    title: "Export winners CSV",
    description: "Download draw history for spreadsheets, newsletters, and event records.",
  },
  {
    title: "QR share",
    description: "Show a QR code with the results link for in-person fundraisers and classrooms.",
  },
  {
    title: "Public-friendly layout",
    description: "Hide the inputs panel and show only the wheel for audiences.",
  },
] as const

export const RAFFLE_SPIN_WHEEL_VS_PRIZE = [
  {
    aspect: "What goes on the wheel",
    raffle: "Participants, entrants, or ticket holders.",
    prize: "Prizes, discounts, merch, or rewards.",
  },
  {
    aspect: "What the result means",
    raffle: "Who won this draw.",
    prize: "Which prize was selected.",
  },
  {
    aspect: "Best for",
    raffle: "Raffles, contests, stream giveaways of people, ticket draws.",
    prize: "Spin-to-win promotions and reward reveals.",
  },
] as const

export type RaffleLinkItem = {
  label: string
  href: string
  description: string
}

export const RAFFLE_SPIN_WHEEL_RELATED_TOOLS: RaffleLinkItem[] = [
  {
    label: "Prize Wheel Spinner",
    href: "/prize-wheel-spinner",
    description: "Put prizes on the wheel for spin-to-win promotions.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "General-purpose name spinner for any list.",
  },
  {
    label: "Giveaway Name Picker",
    href: "/giveaway-name-picker",
    description: "Name-picker spoke tuned for giveaway entrants.",
  },
  {
    label: "Weighted Wheel",
    href: "/weighted-wheel-spinner",
    description: "Disclosed custom odds when equal tickets are not enough.",
  },
  {
    label: "Team Picker Wheel",
    href: "/spin-random-team-picker-wheel",
    description: "Split people into random groups.",
  },
  {
    label: "Finger Picker",
    href: "/finger-picker",
    description: "Multi-touch who-goes-first picker for games.",
  },
  {
    label: "Wheel of Fortune",
    href: "/wheel-of-fortune",
    description: "Fortune-style custom spins for parties and classrooms.",
  },
]

export const RAFFLE_SPIN_WHEEL_POPULAR_TEMPLATES: RaffleLinkItem[] = [
  {
    label: "Random Winner Picker",
    href: "/random-winner-picker",
    description: "Quick single-winner participant draw.",
  },
  {
    label: "Contest Winner Picker",
    href: "/contest-winner-picker",
    description: "Elimination-style contest draw.",
  },
  {
    label: "Giveaway Winner Picker",
    href: "/giveaway-winner-picker",
    description: "Stream or social giveaway entrants.",
  },
  {
    label: "Classroom Raffle Wheel",
    href: "/classroom-raffle-wheel",
    description: "Numbered ticket draws for class prizes.",
  },
  {
    label: "Charity Raffle Wheel",
    href: "/charity-raffle-wheel",
    description: "Transparent fundraiser winner draws.",
  },
]

export const RAFFLE_SPIN_WHEEL_FAQ_ITEMS = [
  {
    question: "How do I pick a raffle winner fairly?",
    answer:
      "Paste every eligible entrant once (or with ticket weight), keep the list visible, then spin. Use Elimination Mode if you will draw multiple winners in sequence.",
  },
  {
    question: "What is the difference between Raffle Spin Wheel and Prize Wheel?",
    answer:
      "Raffle Spin Wheel selects people (who won). Prize Wheel selects prizes (what they win). Use raffle for entrants; use prize wheel when rewards themselves are on the slices.",
  },
  {
    question: "Can I remove a winner and keep drawing?",
    answer:
      "Yes. Turn on Elimination / Remove winner after spin so each winner leaves the pool before the next draw.",
  },
  {
    question: "Can the same person have more than one chance?",
    answer:
      "Yes. Add duplicate name lines or raise that person’s weight so they get more tickets on the wheel.",
  },
  {
    question: "Can I share raffle results?",
    answer:
      "Yes. After you have draw history, use Share results to copy a link or show a QR code. Recipients see the winner order and prize labels without your remaining entrant list.",
  },
  {
    question: "Can I generate numbered tickets?",
    answer:
      "Yes. Open Ticket tools to generate Ticket 01–N, or expand existing weights into duplicate equal tickets. Export winners as CSV when you need a spreadsheet record.",
  },
  {
    question: "Is this free to use?",
    answer: "Yes. You can run raffle draws in the browser without creating an account.",
  },
] as const
