import { HOME_SITE_URL } from "@/lib/home-seo"
import { YES_NO_PICKER_USE_CASES, type YesNoPickerUseCaseId } from "@/lib/yes-no-picker-use-cases"

export const YES_NO_PICKER_SITE_URL = HOME_SITE_URL

/** Canonical pillar path — primary keyword URL. */
export const YES_NO_PICKER_PATH = "/yes-or-no-wheel"

/** Legacy path kept as a redirect alias to the pillar. */
export const YES_NO_PICKER_LEGACY_PATH = "/yes-no-picker-wheel"

export const YES_NO_PICKER_URL = `${YES_NO_PICKER_SITE_URL}${YES_NO_PICKER_PATH}`

export const YES_NO_PICKER_PAGE_TITLE =
  "Yes or No Wheel | Free Online Decision Spinner"

export const YES_NO_PICKER_PAGE_DESCRIPTION =
  "Spin the free Yes or No Wheel to make quick and fair decisions. Use our customizable decision spinner whenever you need a random yes or no answer in seconds."

export const YES_NO_PICKER_H1 = "Yes or No Wheel"

/** Short chrome title above the tool (not the SEO H1). */
export const YES_NO_PICKER_SHORT_TITLE = "Yes or No Wheel"

export const YES_NO_PICKER_HERO_INTRO =
  "Can't decide? Spin the Yes or No Wheel and let chance choose for you. Whether you're making a small everyday decision, settling a friendly debate, picking a challenge, or adding fun to a game, this free online spinner gives you an instant and unbiased yes or no answer. Customize the wheel, save it, and spin as many times as you like."

export const YES_NO_PICKER_KEYWORDS = [
  "yes or no wheel",
  "yes or no picker wheel",
  "yes or no wheel picker",
  "yes or no spinner",
  "yes no wheel",
  "spin yes or no",
  "yes no picker",
  "decision wheel",
  "random decision maker",
  "yes or no generator",
  "yes or no spinner wheel",
  "make a decision",
  "choose randomly",
  "spin the wheel",
  "answer yes or no",
  "random choice",
  "quick decision tool",
  "online yes or no wheel",
] as const

export const YES_NO_PICKER_ON_THIS_PAGE = [
  { id: "yn-popular-wheels", label: "Popular yes or no wheels" },
  { id: "yn-spin-wheel", label: "Spin the Yes or No Wheel" },
  { id: "yn-customize", label: "Customize your decision wheel" },
  { id: "yn-options", label: "How this tool's options work" },
  { id: "yn-when-to-use", label: "When to use a Yes or No Wheel" },
  { id: "yn-vs-coin", label: "Wheel vs coin flip" },
  { id: "yn-why", label: "Why choose our Yes or No Wheel" },
  { id: "yn-ideas", label: "Everyday, classroom & party ideas" },
  { id: "yn-tips", label: "Tips for better decisions" },
  { id: "yn-related", label: "Related tools" },
  { id: "yn-faq", label: "FAQ" },
] as const

export type YesNoPickerLinkItem = {
  label: string
  href: string
  description: string
}

/** Popular modes — cluster spokes use dedicated routes; other modes stay query deep links. */
export const YES_NO_PICKER_POPULAR_WHEELS: YesNoPickerLinkItem[] = [
  {
    label: "Yes No Wheel",
    href: "/yes-no-wheel",
    description: "Classic binary spin for a fast yes or no answer.",
  },
  {
    label: "Decision Wheel",
    href: "/decision-wheel",
    description: "A random decision maker for everyday choices.",
  },
  {
    label: "Maybe Wheel",
    href: "/maybe-wheel",
    description: "YES, NO, or MAYBE when a third answer fits better.",
  },
  {
    label: "Should I Wheel",
    href: "/should-i-wheel",
    description: "Answer “Should I…?” with a spin and optional AI context.",
  },
  {
    label: "Either Or Wheel",
    href: "/either-or-wheel",
    description: "Choose either or between two clear alternatives.",
  },
  {
    label: "This or That Wheel",
    href: "/this-or-that-wheel",
    description: "THIS vs THAT for icebreakers, games, and preference picks.",
  },
  {
    label: "True False Wheel",
    href: "/true-false-wheel",
    description: "Spin TRUE or FALSE for quizzes and party prompts.",
  },
  {
    label: "Pros and Cons Wheel",
    href: "/pros-and-cons-wheel",
    description: "Land on PRO or CON for debates and brainstorms.",
  },
  {
    label: "Fair Coin Flip Wheel",
    href: `${YES_NO_PICKER_PATH}?mode=fair-coin`,
    description: "HEADS vs TAILS—a visual coin flip for 50/50 calls.",
  },
  {
    label: "Truth or Dare Wheel",
    href: `${YES_NO_PICKER_PATH}?mode=truth-check`,
    description: "TRUTH or DARE with elimination for party games.",
  },
]

export const YES_NO_PICKER_CUSTOMIZE_POINTS = [
  {
    title: "Change Yes and No labels",
    description:
      "Rename slices in the Text tab—GO/STAY, HEADS/TAILS, TRUTH/DARE, or any wording that matches your activity.",
  },
  {
    title: "Add more options if needed",
    description:
      "Switch to Yes / No / Maybe, increase input sets, or load a popular mode when a binary answer is not enough.",
  },
  {
    title: "Customize colors",
    description:
      "Pick Style palettes and Themes so your yes or no spinner looks clear on screen, streams, and classrooms.",
  },
  {
    title: "Adjust spin duration",
    description:
      "Tune spin timing in Settings for a quick decision tool or a longer, more dramatic spin the wheel moment.",
  },
  {
    title: "Save your wheel",
    description:
      "Keep custom setups in My Wheels on this device so you can reopen the same decision wheel later.",
  },
  {
    title: "Share it with others",
    description:
      "Use Social tools and share links so friends, classmates, or teammates can spin the same yes or no wheel picker.",
  },
] as const

/** Explains each Yes / No Controls option for the complete guide. */
export const YES_NO_PICKER_OPTIONS_GUIDE = [
  {
    title: "Action Mode",
    description:
      "Normal Mode keeps every option on the wheel after a spin. Elimination Mode removes the winner (synced with Manage → Remove winner) so follow-up spins choose from what’s left—useful for multi-round party games.",
  },
  {
    title: "Manual vs AI",
    description:
      "Manual lets you build the decision yourself. AI Mode asks what decision you are facing and can suggest advice or slice wording so you spend less time setting up the wheel.",
  },
  {
    title: "Mode (YES or NO / MAYBE)",
    description:
      "Start with a classic YES or NO binary, or switch to YES / NO / MAYBE when you want a third outcome. Popular templates (Decision, Should I, Truth or Dare) load matching modes automatically.",
  },
  {
    title: "Input sets",
    description:
      "Choose 1–5 input sets to add more slices beyond a simple pair. Higher sets give you more options on the wheel for either/or lists, pros and cons, or party prompts.",
  },
  {
    title: "Tool Title, Description & Result Title",
    description:
      "Rename the tool header and result card so the spin matches your question—“Should we order pizza?” reads clearer than a generic Yes or No label when you share or project the page.",
  },
  {
    title: "Show stats",
    description:
      "Toggle totals and percentages on the wheel so viewers can see relative odds at a glance. Pair with Style palettes when you stream or present in class.",
  },
  {
    title: "Text tab & CSV",
    description:
      "Paste one option per line and Apply text, or import/export CSV when you already have a list of choices from a spreadsheet.",
  },
  {
    title: "Style, Themes, Confetti & Sound",
    description:
      "Apply color palettes and Themes under Style. Confetti and Sound (also under Other Options) control celebration feedback after a spin—turn them off for quieter classrooms.",
  },
  {
    title: "Other Options & Share",
    description:
      "Import, Export, Share, Embed, QR Code, Fullscreen, and OBS Overlay help you reuse or broadcast the same decision wheel. My Wheels saves setups on this device for later.",
  },
] as const

export const YES_NO_PICKER_WHEN_TO_USE = [
  {
    title: "Make everyday decisions",
    description: "Order takeout, watch a movie, go for a walk, or start a project—spin for a quick random choice.",
  },
  {
    title: "Settle friendly debates",
    description: "Let the online yes or no wheel answer yes or no when opinions are tied.",
  },
  {
    title: "Classroom activities",
    description: "Pick a volunteer, choose between two activities, or run warm-up games fairly.",
  },
  {
    title: "Icebreaker games",
    description: "Break the ice with a fun yes no picker that gets everyone watching the same spin.",
  },
  {
    title: "Family game nights",
    description: "Decide the next round, challenge, or movie pick without endless discussion.",
  },
  {
    title: "Social media challenges",
    description: "Spin live for dares, prompts, or challenge accept/decline moments.",
  },
  {
    title: "Team activities",
    description: "Use a decision wheel for group votes, standups, or light team-building choices.",
  },
  {
    title: "Fun dares & workout challenges",
    description: "Accept a dare, pick a workout finisher, or choose party-game prompts at random.",
  },
  {
    title: "Party games",
    description: "Truth or dare starters, challenge selectors, and group participation spins.",
  },
] as const

export const YES_NO_PICKER_USE_CASES_SEO = YES_NO_PICKER_USE_CASES.map((u) => ({
  title: u.label,
  description: u.description,
  href: `${YES_NO_PICKER_PATH}?mode=${u.id}` as const,
  id: u.id as YesNoPickerUseCaseId,
}))

export const YES_NO_PICKER_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Visual spinning animation everyone can watch",
    coin: "Simple heads or tails",
  },
  {
    aspect: "Customization",
    wheel: "Fully customizable labels, colors, and modes",
    coin: "Fixed outcomes",
  },
  {
    aspect: "Sharing",
    wheel: "Easy to share and reuse online",
    coin: "Not customizable or shareable as a tool",
  },
  {
    aspect: "Groups",
    wheel: "More engaging for groups, parties, and classrooms",
    coin: "Better for quick solo 50/50 decisions",
  },
] as const

export const YES_NO_PICKER_WHY_POINTS = [
  {
    title: "Fair random selection",
    description: "Equal slices keep every spin a transparent random choice—ideal when you need an unbiased answer.",
  },
  {
    title: "Instant results",
    description: "Spin once and get a yes or no answer in seconds with a clear winner highlight.",
  },
  {
    title: "No signup required",
    description: "Open the page and spin. Optional saves stay on this device via My Wheels.",
  },
  {
    title: "Mobile friendly",
    description: "Works as a quick decision tool on phone, tablet, or desktop in any modern browser.",
  },
  {
    title: "Fully customizable",
    description: "Change labels, colors, spin feel, and modes—or start from a popular yes or no spinner preset.",
  },
  {
    title: "Unlimited spins",
    description: "Spin as many times as you like for games, debates, and everyday decisions.",
  },
  {
    title: "Save and reuse wheels",
    description: "Keep your favorite decision wheel setups ready for the next classroom, party, or team call.",
  },
  {
    title: "Works in any modern browser",
    description: "No app install—just open the Yes or No Wheel and choose randomly whenever you need it.",
  },
] as const

export const YES_NO_PICKER_EVERYDAY_IDEAS = [
  "Should I order takeout?",
  "Should I watch a movie?",
  "Should I go for a walk?",
  "Should I start that project today?",
] as const

export const YES_NO_PICKER_CLASSROOM_IDEAS = [
  "Pick a volunteer",
  "Decide between two activities",
  "Warm-up games",
  "Group participation",
] as const

export const YES_NO_PICKER_PARTY_IDEAS = [
  "Truth or Dare starter",
  "Challenge selector",
  "Icebreaker questions",
  "Family game night",
] as const

export const YES_NO_PICKER_RELATED_TOOLS: YesNoPickerLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The classic picker wheel for any custom list of options.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin names for classrooms, giveaways, and fair selections.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Spin a random number from any custom range.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Pick a random letter for word games and prompts.",
  },
  {
    label: "Decision Wheel",
    href: "/decision-wheel",
    description: "A dedicated random decision maker in the Yes or No cluster.",
  },
  {
    label: "Maybe Wheel",
    href: "/maybe-wheel",
    description: "YES, NO, or MAYBE when a binary answer is not enough.",
  },
  {
    label: "Should I Wheel",
    href: "/should-i-wheel",
    description: "Spin “Should I…?” questions with optional AI context.",
  },
  {
    label: "Coin Flip",
    href: `${YES_NO_PICKER_PATH}?mode=fair-coin`,
    description: "A visual HEADS/TAILS spin when you want a coin-flip style call.",
  },
  {
    label: "Dice Roller",
    href: "/number-picker-wheel",
    description: "Use the number picker for dice-style random rolls and ranges.",
  },
  {
    label: "Truth or Dare Wheel",
    href: `${YES_NO_PICKER_PATH}?mode=truth-check`,
    description: "Spin TRUTH or DARE for parties and icebreakers.",
  },
]

export const YES_NO_PICKER_ARTICLE_TITLE = "Spin the Yes or No Wheel"

export const YES_NO_PICKER_ARTICLE_INTRO = [
  "A Yes or No Wheel is a free online decision spinner that gives you one clear answer each time you spin: yes or no. It works as a yes or no picker wheel, yes or no spinner, and random decision maker whenever you need to choose randomly without overthinking.",
  "Instead of flipping a coin alone, you spin the wheel so everyone can watch the same fair result. Use it as a yes no wheel for everyday choices, a yes or no generator for games, or a yes or no spinner wheel when you want something more visual and shareable than a simple flip.",
  "Open the tool above, customize your slices if you like, and spin yes or no as many times as you need. The interactive wheel stays the focus—this guide simply helps you get the most from a quick decision tool.",
] as const

export const YES_NO_PICKER_TIPS =
  "The Yes or No Wheel is best for low-stakes or fun decisions—everyday choices, games, classrooms, and friendly debates. For important choices involving health, finances, or legal matters, use thoughtful judgment rather than relying on randomness. Chance can break a tie; it should not replace careful thinking when the stakes are high."

export const YES_NO_PICKER_FAQ_ITEMS = [
  {
    question: "What is a Yes or No Wheel?",
    answer:
      "A Yes or No Wheel is an online spinner that randomly lands on yes or no (and optionally more options you add). It is a free decision wheel for making a quick, fair random choice.",
  },
  {
    question: "Is the wheel truly random?",
    answer:
      "Each spin picks from the active slices on the wheel. When options share equal weight and slice count, every outcome has an equal chance—so the result is a fair random selection for practical use.",
  },
  {
    question: "Can I customize the wheel?",
    answer:
      "Yes. Change labels, colors, themes, spin settings, and modes. You can also load popular presets like Yes/No/Maybe, coin flip, or Truth or Dare.",
  },
  {
    question: 'Can I replace "Yes" and "No" with my own options?',
    answer:
      "Yes. Edit labels in the Text tab or use modes such as GO/STAY, HEADS/TAILS, or TRUTH/DARE so the answer matches your activity.",
  },
  {
    question: "Is every outcome equally likely?",
    answer:
      "When each option has the same weight and the same number of slices, yes—each enabled option is equally likely. You can add more sets to balance options around the wheel.",
  },
  {
    question: "Can I save my custom wheel?",
    answer:
      "Yes. Save setups in My Wheels on this device so you can reopen your custom yes or no picker later without rebuilding it.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The online yes or no wheel is mobile friendly and works in modern browsers on phones, tablets, and desktops.",
  },
  {
    question: "Can I use it for classroom games or parties?",
    answer:
      "Absolutely. Teachers use it for volunteers and warm-ups; families and friends use it for icebreakers, dares, and party games.",
  },
  {
    question: "What's the difference between a Yes or No Wheel and a coin flip?",
    answer:
      "A coin flip is fast and fixed. A Yes or No Wheel adds a visual spin, custom labels, optional extra options, sharing, and group engagement—while still delivering a fair yes or no answer.",
  },
  {
    question: "Is the Yes or No Wheel free to use?",
    answer:
      "Yes. You can spin without creating an account. Optional features like saving wheels run on this device.",
  },
] as const
