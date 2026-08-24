import { HOME_SITE_URL } from "@/lib/home-seo"

export const NARUTO_WHEEL_PATH = "/naruto-spin-wheel-picker"
export const NARUTO_WHEEL_SITE_URL = HOME_SITE_URL
export const NARUTO_WHEEL_URL = `${HOME_SITE_URL}${NARUTO_WHEEL_PATH}`
export const NARUTO_WHEEL_OG_IMAGE_URL = `${HOME_SITE_URL}/og/naruto-wheel.svg`
export const NARUTO_WHEEL_PAGE_TITLE = "Naruto Wheel | Random Naruto Character Spinner"
export const NARUTO_WHEEL_PAGE_DESCRIPTION =
  "Spin a free Naruto wheel to pick a random Naruto character, shinobi, Akatsuki member, Hokage, clan, village, or jutsu."
export const NARUTO_WHEEL_H1 = "Naruto Wheel"
export const NARUTO_WHEEL_SHORT_TITLE = "Naruto Wheel"
export const NARUTO_WHEEL_HERO_INTRO =
  "Pick a random Naruto character with a fair, equal-odds Naruto Wheel. Filter ready-made templates, add custom entries, upload your own images, or draft without repeats in Elimination mode."
export const NARUTO_WHEEL_ARTICLE_TITLE = "Spin the Naruto Wheel"
export const NARUTO_WHEEL_DISCLAIMER =
  "This is an independent fan-made entertainment tool. It is not affiliated with or endorsed by Masashi Kishimoto, Shueisha, Studio Pierrot, or Viz Media. Character and series names belong to their respective owners."

export const NARUTO_WHEEL_KEYWORDS = [
  "naruto spin the wheel", "naruto wheel", "naruto wheel", "naruto spinner",
  "naruto picker", "random naruto character", "naruto randomizer", "anime wheel",
  "character wheel", "wheel spinner", "Naruto character picker",
  "Naruto challenge wheel", "random shinobi", "villain wheel",
  "Naruto character generator", "anime challenge wheel", "Naruto team picker",
] as const

export const NARUTO_WHEEL_ON_THIS_PAGE = [
  { id: "naruto-popular", label: "Popular Naruto templates" },
  { id: "naruto-spin-wheel", label: "Spin the Naruto wheel" },
  { id: "naruto-whats-on", label: "What you can put on the wheel" },
  { id: "naruto-features", label: "Features on this page" },
  { id: "naruto-create", label: "Create your own Naruto wheel" },
  { id: "naruto-how-it-works", label: "How the Naruto wheel works" },
  { id: "naruto-options", label: "How this tool's options work" },
  { id: "naruto-use-cases", label: "Common ways to use a Naruto picker wheel" },
  { id: "naruto-why", label: "Why use a Naruto picker wheel" },
  { id: "naruto-comparison", label: "Picker wheel vs random generator" },
  { id: "naruto-tips", label: "Groups, fairness & fan use" },
  { id: "naruto-customize", label: "How to customize your wheel" },
  { id: "naruto-related", label: "Related tools" },
  { id: "naruto-cluster", label: "Naruto topic cluster" },
  { id: "naruto-faq", label: "FAQ" },
  { id: "naruto-disclaimer", label: "Fan-tool disclaimer" },
] as const

export const NARUTO_WHEEL_ARTICLE_INTRO = [
  "Naruto Wheel is a visual Naruto character picker for moments when a plain list feels too predictable. The wheel starts with a broad catalog of characters, from familiar genin, jōnin, and Kage to villains and jinchūriki. Press the spin button and the pointer lands on one enabled slice. Because every enabled entry uses the same weight, each name has equal odds when it appears once.",
  "The template strip focuses the randomizer: Part I, Shippuden, Boruto, Akatsuki, Hokage, Uchiha, and more. Separate jutsu, village, and clan templates load concept lists instead of characters—great for drawing prompts, fan challenges, and discussion games.",
  "For a normal spin, leave Action Mode on Normal. Choose Elimination when you are drafting a team or running several rounds and do not want the same winner twice. Results stores the latest picks so a group can recap the order without writing every result down.",
] as const

export const NARUTO_WHEEL_WHATS_ON_WHEEL = [
  "Naruto characters — students, teachers, villains, and villains",
  "Grade filters — Grade 1 and Special Grade shortlists",
  "Jutsus and kekkei genkai concepts for creative prompts",
  "Custom entries with emoji and optional user-uploaded images",
  "Favorites and comparison shortlists before you spin",
  "Display modes — emoji + name, emoji only, or name only",
  "Popular templates — character, villain, spirit, Mahoraga, technique, domain, and team presets",
] as const

export const NARUTO_WHEEL_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive wheel sits above this guide. Load a template or the full catalog and spin without leaving the page.",
  },
  {
    title: "Catalog filters & templates",
    description:
      "Switch students, teachers, villains, spirits, grades, techniques, or domains—or open a ready-made spoke page.",
  },
  {
    title: "Favorites, comparison & preview",
    description:
      "Heart entries, compare up to four side by side, and open preview details before you commit to a spin.",
  },
  {
    title: "Elimination & Results history",
    description:
      "Remove winners across rounds for team drafts, then review recent picks from Results or Spin History.",
  },
  {
    title: "Text, Style & Sound",
    description:
      "Bulk-edit lists, recolor slices, toggle confetti and spin sounds, and go fullscreen for group calls or streams.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips open achievements, spin analytics, Social sharing, and advanced game modes.",
  },
  {
    title: "My Wheels on this device",
    description:
      "Save custom Naruto wheels locally so the same shortlist is ready for the next challenge night.",
  },
] as const

export const NARUTO_WHEEL_CREATE_POINTS = [
  {
    title: "Add custom entries",
    description:
      "Type a name and emoji in Inputs, or paste one name per line in the Text tab to enable matching catalog entries.",
  },
  {
    title: "Choose favorites",
    description:
      "Heart characters into Favorites and reopen them from the sidebar for quick shortlists before you spin.",
  },
  {
    title: "Load templates",
    description:
      "Open student, villain, spirit, technique, domain, or team presets—or build a custom challenge wheel from scratch.",
  },
  {
    title: "Customize colors",
    description:
      "Style tab palettes and Themes recolor wheel slices so your Naruto wheel matches your stream or group branding.",
  },
  {
    title: "Save wheels",
    description:
      "Keep custom Naruto wheels in My Wheels on this device for the next club meeting or watch party.",
  },
  {
    title: "Share wheels",
    description:
      "Open Social under the spinner and share the page link so friends can load the same tool on their device.",
  },
] as const

export const NARUTO_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your list",
    description:
      "Load the full catalog, pick a category template, or open a spoke page—or paste custom names in Text.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Toggle entries, set display mode, favorite shortlists, enable elimination, and tune colors from Style.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click Spin or tap the wheel so everyone sees a fair random character, technique, or domain land live.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Accept the pick, open Results for recent winners, or continue in Elimination until the draft is complete.",
  },
] as const

export const NARUTO_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Category filters",
    description:
      "Choose All or a single category (Students, Villains, Domains, and more) in Inputs. The wheel rebuilds with matching entries.",
  },
  {
    title: "Display Options & Show Title",
    description:
      "In the Style tab, pick Emoji & Name, Emoji Only, or Name Only for slice labels. Toggle Show title for the wheel heading preference.",
  },
  {
    title: "Favorites",
    description:
      "Tap the heart on any entry or open Favorites from the sidebar header. Starred characters stay ready for quick shortlists.",
  },
  {
    title: "Comparison",
    description:
      "Add up to four entries to Comparison from the list or the compare icon. The modal shows name, emoji, and categories side by side.",
  },
  {
    title: "Preview",
    description:
      "Open preview on a row to see categories, school, clan, and optional uploaded images before enabling it on the wheel.",
  },
  {
    title: "Collection Stats",
    description:
      "Open the Stats sub-tab under Inputs for category distribution, total spins, and top recent picks.",
  },
  {
    title: "Manual vs AI",
    description:
      "Manual lists every entry with toggles, search, shuffle, and add-random. AI offers chat, analysis, and generator presets for focused sets.",
  },
  {
    title: "Action Mode & Game Mode",
    description:
      "Normal keeps every entry after a spin. Elimination removes the winner (synced with Remove winner in Settings). Manual adds names under the wheel. Game Mode mirrors the same setting.",
  },
  {
    title: "Text tab (bulk list)",
    description:
      "Paste one name per line to enable matching catalog entries. Export your current list, load what's on the wheel, or import a challenge roster.",
  },
  {
    title: "Style, Palettes & Themes",
    description:
      "Style sets display mode. Color palettes recolor slices; Themes unlock visual styles (earn more through Achievements).",
  },
  {
    title: "Other Options (sound & spin)",
    description:
      "Other Options toggles confetti and spin sound, opens Analytics, fullscreen, Settings, and AI shortcuts.",
  },
  {
    title: "Shuffle, Sort & Manage",
    description:
      "Shuffle randomizes slice order. Manage covers Sort Z–A, remove duplicates, delete blanks, clear all, and Remove winner sync.",
  },
  {
    title: "Results & Spin History",
    description:
      "Results (top-left) opens recent winners. Spin History in the sidebar header tracks past spins with a badge count.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips under the wheel open Achievements, Analytics, Social, and Games.",
  },
  {
    title: "Wheel controls",
    description:
      "Mute toggles sounds. Fullscreen expands the spinner. STOP ends a spin early. Click the wheel face or Spin to start.",
  },
] as const

export const NARUTO_WHEEL_USE_CASES_CONTENT = [
  {
    title: "Character challenges",
    description:
      "Assign a random shinobi for drawing prompts, cosplay inspiration, or a no-repeat watch-party challenge.",
  },
  {
    title: "Team drafts",
    description:
      "Use Elimination with the team template to fill roster slots one spin at a time so every pick stays visible.",
  },
  {
    title: "Technique & Domain prompts",
    description:
      "Spin jutsus or kekkei genkais for writing, roleplay, or edit ideas without picking a character.",
  },
  {
    title: "Group debates",
    description:
      "Settle favorite-character arguments with a shared screen spin so the pool and result are transparent.",
  },
] as const

export const NARUTO_WHEEL_WHY_POINTS = [
  {
    title: "Visible fairness",
    description:
      "Everyone sees the enabled list and equal slices before the pointer stops—ideal for groups and streams.",
  },
  {
    title: "Franchise-focused templates",
    description:
      "Stay inside Naruto instead of scrolling a huge all-anime database.",
  },
  {
    title: "Custom control",
    description:
      "Toggle catalog entries, add OCs, upload images, and save wheels for the next session.",
  },
  {
    title: "No-repeat drafts",
    description:
      "Elimination mode removes winners automatically so drafts and challenges stay interesting.",
  },
] as const

export const NARUTO_WHEEL_COMPARISON = [
  {
    aspect: "Visibility",
    wheel: "Full candidate list and live spin are shared on screen",
    generator: "Usually returns a hidden one-click result",
  },
  {
    aspect: "Odds",
    wheel: "Equal weight per enabled entry (transparent)",
    generator: "Odds may be opaque or database-weighted",
  },
  {
    aspect: "Customization",
    wheel: "Templates, toggles, custom entries, images, themes",
    generator: "Often fixed pool with limited editing",
  },
  {
    aspect: "Best for",
    wheel: "Groups, drafts, streams, challenge nights",
    generator: "Solo instant picks across many series",
  },
] as const

export const NARUTO_WHEEL_EEAT_TIPS = [
  {
    title: "Agree on the pool first",
    description:
      "Before spinning, confirm which templates or toggles are active so nobody disputes the result afterward.",
  },
  {
    title: "Share the screen",
    description:
      "On calls or streams, show the full wheel so the spin—and equal slices—are visible to everyone.",
  },
  {
    title: "Use Elimination for drafts",
    description:
      "Remove winners after each pick when filling teams or running multi-round challenges.",
  },
  {
    title: "Keep fan use respectful",
    description:
      "This is an independent entertainment tool. Character names belong to their owners; do not present results as official lore.",
  },
] as const

export const NARUTO_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Tune the catalog",
    description: "Search, filter by category, or clear and rebuild a shortlist of characters you recognize.",
  },
  {
    step: 2,
    title: "Add customs",
    description: "Create OC names, challenge prompts, or techniques, then optionally upload your own image.",
  },
  {
    step: 3,
    title: "Style the wheel",
    description: "Pick display mode, apply a color palette, and choose an unlocked theme.",
  },
  {
    step: 4,
    title: "Save for next time",
    description: "Keep the wheel in My Wheels or export the Text list so the same challenge is ready again.",
  },
] as const

export const NARUTO_WHEEL_FAQ_ITEMS = [
  { question: "What is Naruto Wheel?", answer: "It is a free fan-made randomizer preloaded with Naruto characters and optional technique or kekkei genkai templates." },
  { question: "Does every entry have equal odds?", answer: "Yes. Every enabled entry appears once and has the same chance. Use the Weighted Wheel Spinner when you need unequal probabilities." },
  { question: "Can I add my own Naruto characters or images?", answer: "Yes. Add a custom name and emoji, then upload an image from your device. Uploaded images stay part of your local wheel session." },
  { question: "Can the wheel avoid repeat winners?", answer: "Yes. Choose Elimination mode to disable the winner after each spin, which is useful for team drafts and challenges." },
  { question: "Is this an official Naruto tool?", answer: NARUTO_WHEEL_DISCLAIMER },
] as const

/** @deprecated Prefer NARUTO_WHEEL_FEATURES_REAL for the guide article */
export const NARUTO_WHEEL_FEATURES = NARUTO_WHEEL_FEATURES_REAL

export const NARUTO_WHEEL_USE_CASE_GROUPS = [
  { category: "Challenges", items: ["Assign a character for an edit or drawing prompt", "Choose a cosplay inspiration", "Run a no-repeat character challenge"] },
  { category: "Fans and groups", items: ["Settle favorite-character debates", "Draft random Naruto teams", "Pick discussion or quiz prompts"] },
  { category: "Creative prompts", items: ["Spin a jutsu concept", "Choose a kekkei genkai", "Build a custom original-character wheel"] },
] as const

export const NARUTO_WHEEL_RELATED_TOOLS = [
  { label: "JJK Spin Wheel", href: "/jjk-spin-the-wheel", description: "Pick a random Jujutsu Kaisen character." },
  { label: "Demon Slayer Spin Wheel", href: "/demon-slayer-spin-wheel", description: "Pick Hashira, demons, and breathing styles." },
  { label: "Pokémon Picker Wheel", href: "/pokemon-picker-wheel", description: "Spin a random Pokémon for challenges." },
  { label: "Random Name Picker", href: "/", description: "Build a wheel from any list of names." },
  { label: "Team Picker Wheel", href: "/spin-random-team-picker-wheel", description: "Split people into random teams." },
  { label: "Naruto Quiz", href: "/naruto-quiz", description: "Guess characters, jutsu, clans, villages, and quotes." },
  { label: "Akatsuki Wheel", href: "/akatsuki-wheel", description: "Spin Akatsuki members." },
] as const

export type NarutoWheelLinkItem = {
  label: string
  href: string
  description: string
}
