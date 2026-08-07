import { HOME_SITE_URL } from "@/lib/home-seo"

export const THEME_PICKER_SITE_URL = HOME_SITE_URL
export const THEME_PICKER_PATH = "/spin-random-theme-picker-wheel"
/** Legacy hub URL — permanent redirect source */
export const THEME_PICKER_LEGACY_PATH = "/theme-picker-wheel"
export const THEME_PICKER_URL = `${THEME_PICKER_SITE_URL}${THEME_PICKER_PATH}`
export const THEME_PICKER_OG_IMAGE_URL = `${THEME_PICKER_SITE_URL}/og/theme-picker-wheel.svg`

export const THEME_PICKER_SHORT_TITLE = "Spin Random Theme Picker Wheel"
export const THEME_PICKER_PAGE_TITLE =
  "Spin Random Theme Picker Wheel | Free Theme Generator Online"
export const THEME_PICKER_H1 = "Spin Random Theme Picker Wheel"
export const THEME_PICKER_PAGE_DESCRIPTION =
  "Spin a random theme picker wheel to choose themes for parties, games, writing, drawing, classrooms, and creative challenges. Customize your list and spin free online."

export const THEME_PICKER_HERO_INTRO =
  "Need inspiration for your next activity? Spin Random Theme Picker Wheel helps you randomly select a theme in seconds. Whether you're planning a party, creating content, writing a story, drawing, hosting a classroom activity, or playing games with friends, simply spin the wheel and let chance decide. You can also customize the wheel with your own themes and save it for future use."

export const THEME_PICKER_UPDATED_AT = "2026-08-03"

export const THEME_PICKER_KEYWORDS = [
  "theme picker wheel",
  "theme wheel",
  "random theme picker",
  "theme spinner",
  "random theme generator",
  "theme chooser",
  "theme randomizer",
  "spin the theme wheel",
  "theme selection wheel",
  "wheel picker",
  "choose a random theme",
  "random challenge themes",
  "party theme wheel",
  "writing prompt themes",
  "drawing theme wheel",
  "classroom theme wheel",
  "creative theme ideas",
  "random category picker",
] as const

export const THEME_PICKER_ON_THIS_PAGE = [
  { id: "theme-spin-wheel", label: "Spin Random Theme Picker Wheel" },
  { id: "theme-how-it-works", label: "How the spinner works" },
  { id: "theme-create-own", label: "Create Your Own Theme Wheel" },
  { id: "theme-templates", label: "Popular Theme Wheel Templates" },
  { id: "theme-use-cases", label: "Common ways to use a theme picker" },
  { id: "theme-why", label: "Why use our Theme Picker Wheel?" },
  { id: "theme-vs", label: "Theme Picker vs random idea generator" },
  { id: "theme-questions", label: "What theme should I choose?" },
  { id: "theme-related", label: "Related wheel tools" },
  { id: "theme-faq", label: "Frequently asked questions" },
] as const

export const THEME_PICKER_HOW_IT_WORKS = [
  "Open the Theme Picker Wheel with a ready-made mix of creative themes already loaded.",
  "Spin once for a fair random theme everyone can see—or switch to a focused template first.",
  "Customize the list: add party ideas, writing prompts, drawing subjects, classroom topics, and more.",
  "Adjust colors, attach optional images, and toggle elimination mode when each theme should win only once.",
  "Save the wheel on this device, share a custom setup, or reopen popular theme templates anytime.",
] as const

export const THEME_PICKER_FEATURES = [
  {
    title: "Add custom themes",
    description:
      "Type any theme, prompt, or category onto the wheel so your group spins from a list that matches the activity.",
  },
  {
    title: "Edit theme names",
    description:
      "Rename wedges, reorder entries, and disable options you do not want in the next spin.",
  },
  {
    title: "Change colors",
    description:
      "Give each theme its own wedge color so the spinner stays clear on a projector, livestream, or phone.",
  },
  {
    title: "Upload images",
    description:
      "Attach optional images when visual mood boards help—great for costume, party, or drawing prompts.",
  },
  {
    title: "Save wheels",
    description:
      "Keep separate wheels for parties, classrooms, writing nights, or content series in My Wheels on this browser.",
  },
  {
    title: "Share wheels",
    description:
      "Share a Create Custom Wheel link so friends, students, or teammates open the same exact theme list.",
  },
  {
    title: "Unlimited spins",
    description:
      "Spin as often as you need. Every enabled theme starts with an equal chance unless you edit the board.",
  },
] as const

export type ThemePickerLinkItem = {
  label: string
  href: string
  description: string
  audience?: string
}

export const THEME_PICKER_POPULAR_TEMPLATES: ThemePickerLinkItem[] = [
  {
    label: "Party Theme Wheel",
    href: "/party-theme-wheel",
    description: "Costume, birthday, holiday, and game-night party vibes.",
    audience: "Event organizers",
  },
  {
    label: "Drawing Theme Wheel",
    href: "/drawing-theme-wheel",
    description: "Art prompts for sketchbooks, challenges, and practice.",
    audience: "Artists",
  },
  {
    label: "Writing Theme Wheel",
    href: "/writing-theme-wheel",
    description: "Story genres, settings, and prompt starters for writers.",
    audience: "Writers",
  },
  {
    label: "Classroom Theme Wheel",
    href: "/classroom-theme-wheel",
    description: "Discussion topics, icebreakers, and project themes.",
    audience: "Teachers",
  },
  {
    label: "Halloween Theme Wheel",
    href: "/halloween-theme-wheel",
    description: "Spooky party, costume, and creative challenge ideas.",
    audience: "Holiday fans",
  },
  {
    label: "Christmas Theme Wheel",
    href: "/christmas-theme-wheel",
    description: "Festive party, family, and holiday celebration vibes.",
    audience: "Families",
  },
  {
    label: "Costume Theme Wheel",
    href: "/costume-theme-wheel",
    description: "Character and outfit costume ideas for dress-up events.",
    audience: "Costume planners",
  },
  {
    label: "YouTube Theme Wheel",
    href: "/youtube-theme-wheel",
    description: "Video formats and upload ideas for creators.",
    audience: "Creators",
  },
  {
    label: "TikTok Theme Wheel",
    href: "/tiktok-theme-wheel",
    description: "Short-form challenges and content prompts.",
    audience: "Social creators",
  },
  {
    label: "Photography Theme Wheel",
    href: "/photography-theme-wheel",
    description: "Shoot prompts for practice walks and challenges.",
    audience: "Photographers",
  },
]

export const THEME_PICKER_USE_CASE_GROUPS = [
  {
    title: "Parties",
    items: [
      "Costume parties",
      "Birthday parties",
      "Holiday celebrations",
      "Game nights",
    ],
  },
  {
    title: "Creativity",
    items: [
      "Story writing",
      "Drawing prompts",
      "Art challenges",
      "Photography themes",
    ],
  },
  {
    title: "Classroom",
    items: [
      "Discussion topics",
      "Writing exercises",
      "Student projects",
      "Icebreakers",
    ],
  },
  {
    title: "Content Creation",
    items: [
      "YouTube videos",
      "TikTok challenges",
      "Livestream ideas",
      "Social media posts",
    ],
  },
] as const

export const THEME_PICKER_BENEFITS = [
  "Instant inspiration when you are stuck between ideas",
  "Easy customization for every activity or audience",
  "Unlimited spins with equal odds by default",
  "Save favorite theme wheels on this device",
  "Mobile friendly for classrooms, parties, and creators",
  "Free to use—no account required to spin",
] as const

export const THEME_PICKER_VS_IDEA_GENERATOR = [
  {
    feature: "How it chooses",
    themePicker: "Chooses from your theme list",
    ideaGenerator: "Generates general ideas",
  },
  {
    feature: "Customization",
    themePicker: "Fully customizable wedges, colors, and images",
    ideaGenerator: "Usually fixed suggestions",
  },
  {
    feature: "Best for",
    themePicker: "Great for groups that need a visible fair pick",
    ideaGenerator: "Better for solo brainstorming",
  },
  {
    feature: "Experience",
    themePicker: "Visual spinning experience everyone can watch",
    ideaGenerator: "Simple text output",
  },
] as const

export const THEME_PICKER_QUESTION_BLOCKS = [
  {
    id: "what-theme-choose",
    title: "What Theme Should I Choose?",
    href: "/what-theme-should-i-choose",
    body: "If you're stuck between several ideas, spin the Theme Picker Wheel to make a random choice. It's a fun way to remove indecision and discover themes you might not have picked yourself.",
  },
  {
    id: "how-pick-random",
    title: "How Do I Pick a Random Theme?",
    body: "Add your favorite themes to the wheel and spin it once. Every entry has an equal chance of being selected unless you customize the wheel by adding, removing, or disabling options.",
  },
  {
    id: "party-theme",
    title: "What Party Theme Should I Have?",
    href: "/what-party-theme-should-i-have",
    body: "Create a party-themed wheel with ideas like retro, beach, superhero, movie night, tropical, or masquerade, then let the wheel choose your next event theme—or open the dedicated party question page.",
  },
  {
    id: "draw-theme",
    title: "What Theme Should I Draw?",
    href: "/what-theme-should-i-draw",
    body: "Artists often use the Theme Picker Wheel for creative practice. Add prompts like fantasy, nature, animals, sci-fi, food, or architecture and spin whenever you need inspiration.",
  },
  {
    id: "write-theme",
    title: "What Theme Should I Write About?",
    href: "/what-theme-should-i-write-about",
    body: "Writers can build custom wheels with genres, settings, characters, or story prompts. A random theme is a great way to overcome writer's block and start something new.",
  },
  {
    id: "video-theme",
    title: "What Theme Should My Video Be?",
    href: "/what-theme-should-my-video-be",
    body: "Creators can spin for YouTube formats, challenges, tutorials, and upload ideas—or open the video theme question page for a ready-made content list.",
  },
] as const

export const THEME_PICKER_RELATED_TOOLS: ThemePickerLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "Spin any custom list of options.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Settle a quick two-choice decision.",
  },
  {
    label: "Prize Wheel Spinner",
    href: "/prize-wheel-spinner",
    description: "Run giveaways and reward spins.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Pick a random color for creative projects.",
  },
  {
    label: "DTI Wheel Outfit Picker",
    href: "/dti-wheel-outfit-picker",
    description: "Roblox Dress to Impress outfit themes.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Choose who goes first from a name list.",
  },
  {
    label: "Wheel of Fortune",
    href: "/wheel-of-fortune",
    description: "Custom decision and activity wheels.",
  },
]

export type ThemePickerFaqItem = {
  question: string
  answer: string
}

export const THEME_PICKER_FAQ_ITEMS: readonly ThemePickerFaqItem[] = [
  {
    question: "What is a Theme Picker Wheel?",
    answer:
      "A Theme Picker Wheel is a free online spinner that randomly selects a theme from the list you enable. Use it for parties, writing, drawing, classrooms, content creation, and creative challenges.",
  },
  {
    question: "Can I add my own themes?",
    answer:
      "Yes. Open the Inputs panel to add, rename, reorder, enable, or disable any theme. You can also paste a bulk list when you need a fast custom board.",
  },
  {
    question: "Can I save my custom wheel?",
    answer:
      "Yes. Custom setups stay in My Wheels on this device so you can reopen the same theme list later. For sharing the exact list, use Create Custom Wheel from the header.",
  },
  {
    question: "Does every theme have an equal chance?",
    answer:
      "Yes by default. Every enabled entry gets one equal slice. If you add duplicate labels or disable options, you intentionally change the odds for that spin session.",
  },
  {
    question: "Can I share my wheel with others?",
    answer:
      "Yes. Share a Create Custom Wheel link so friends open the same entries, or send them a focused template page like the Party or Writing Theme Wheel.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The Theme Picker Wheel works in modern mobile, tablet, and desktop browsers.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. Spinning, editing themes, saving wheels on this device, and using the templates are free. No account is required to start.",
  },
]
