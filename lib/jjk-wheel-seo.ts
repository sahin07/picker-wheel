import { HOME_SITE_URL } from "@/lib/home-seo"

export const JJK_WHEEL_PATH = "/jjk-spin-the-wheel"
export const JJK_WHEEL_SITE_URL = HOME_SITE_URL
export const JJK_WHEEL_URL = `${HOME_SITE_URL}${JJK_WHEEL_PATH}`
export const JJK_WHEEL_OG_IMAGE_URL = `${HOME_SITE_URL}/og/jjk-spin-wheel.svg`
export const JJK_WHEEL_PAGE_TITLE = "JJK Spin the Wheel | Random Jujutsu Kaisen Character Picker & OC Maker"
export const JJK_WHEEL_PAGE_DESCRIPTION =
  "Spin the free JJK wheel to pick a random Jujutsu Kaisen character from 61 sorcerers, villains, and cursed spirits, or build your own character by spinning grade, cursed technique, and Domain Expansion."
export const JJK_WHEEL_H1 = "JJK Spin the Wheel"
export const JJK_WHEEL_SHORT_TITLE = "JJK Spin the Wheel"
export const JJK_WHEEL_HERO_INTRO =
  "Pick a random JJK character with a fair, equal-odds Jujutsu Kaisen wheel, or build your own sorcerer one spin at a time: grade, cursed technique, Domain Expansion, school, mentor, and rival. Add custom entries, upload images, or draft without repeats in Elimination mode."
export const JJK_WHEEL_ARTICLE_TITLE = "Spin the JJK Wheel"
export const JJK_WHEEL_DISCLAIMER =
  "This is an independent fan-made entertainment tool. It is not affiliated with or endorsed by Gege Akutami, Shueisha, MAPPA, or Toho. Character and series names belong to their respective owners."

export const JJK_WHEEL_KEYWORDS = [
  "jjk spin the wheel", "jjk wheel", "jujutsu kaisen wheel", "jujutsu kaisen spinner",
  "jjk picker", "random jjk character", "jjk randomizer", "anime wheel",
  "character wheel", "wheel spinner", "Jujutsu Kaisen character picker",
  "JJK challenge wheel", "random sorcerer", "cursed spirit wheel",
  "JJK character generator", "anime challenge wheel", "JJK team picker",
] as const

export const JJK_WHEEL_ON_THIS_PAGE = [
  { id: "jjk-popular", label: "Popular JJK templates" },
  { id: "jjk-spin-wheel", label: "Spin the JJK wheel" },
  { id: "jjk-oc-builder", label: "Build your own JJK character" },
  { id: "jjk-whats-on", label: "What you can put on the wheel" },
  { id: "jjk-features", label: "Features on this page" },
  { id: "jjk-create", label: "Create your own JJK wheel" },
  { id: "jjk-how-it-works", label: "How the JJK wheel works" },
  { id: "jjk-options", label: "How this tool's options work" },
  { id: "jjk-use-cases", label: "Common ways to use a JJK picker wheel" },
  { id: "jjk-why", label: "Why use a JJK picker wheel" },
  { id: "jjk-comparison", label: "Picker wheel vs random generator" },
  { id: "jjk-tips", label: "Groups, fairness & fan use" },
  { id: "jjk-customize", label: "How to customize your wheel" },
  { id: "jjk-related", label: "Related tools" },
  { id: "jjk-cluster", label: "JJK topic cluster" },
  { id: "jjk-faq", label: "FAQ" },
  { id: "jjk-disclaimer", label: "Fan-tool disclaimer" },
] as const

export const JJK_WHEEL_ARTICLE_INTRO = [
  "JJK Spin Wheel picker is a visual Jujutsu Kaisen character picker for moments when a plain list feels too predictable. The wheel starts with a broad catalog of characters, from familiar students and teachers to villains and cursed spirits. Press the spin button and the pointer lands on one enabled slice. Because every enabled entry uses the same weight, each name has equal odds when it appears once.",
  "Use the template strip when you want a focused randomizer. The student wheel combines Tokyo and Kyoto school entries, while the villain and cursed-spirit pages narrow the pool to antagonists. Separate cursed technique and Domain Expansion templates contain concepts rather than characters, so they are useful for drawing prompts, fan challenges, roleplay ideas, and discussion games.",
  "For a normal spin, leave Action Mode on Normal. Choose Elimination when you are drafting a team or running several rounds and do not want the same winner twice. Results stores the latest picks so a group can recap the order without writing every result down.",
] as const

export const JJK_WHEEL_OC_BUILDER_INTRO = [
  "One of the most popular ways to use a JJK spin wheel is to build an original sorcerer one spin at a time. Each spin locks in a single trait (grade, cursed technique, Domain Expansion, school, mentor, and rival), so the finished character is a combination nobody picked on purpose. That surprise is the whole point of the challenge.",
  "Everything you need is already on this site: 61 Jujutsu Kaisen characters, 12 cursed techniques, 8 Domain Expansions, and 10 Ten Shadows shikigami. Work through the spins below in order, spin once per step, and note each result (Results keeps your recent picks if you lose track).",
] as const

export const JJK_WHEEL_OC_BUILDER_STEPS = [
  {
    step: 1,
    title: "Spin your grade",
    description:
      "Open the Text tab above and paste Grade 4, Grade 3, Semi-Grade 2, Grade 2, Semi-Grade 1, Grade 1, and Special Grade, one per line, then spin once. The grade sets how strong your sorcerer is at the start of their story.",
  },
  {
    step: 2,
    title: "Spin your cursed technique",
    description:
      "Load the cursed technique template and spin for your innate technique: Limitless, Ten Shadows, Shrine, Boogie Woogie, Cursed Speech, and more.",
    href: "/jjk-cursed-technique-wheel",
    linkLabel: "Open the Cursed Technique Wheel",
  },
  {
    step: 3,
    title: "Spin your Domain Expansion",
    description:
      "Spin the Domain Expansion wheel next. Many groups use a house rule: if you rolled Grade 3 or lower, the domain is 'not unlocked yet' and becomes a future power-up for your character.",
    href: "/jjk-domain-expansion-wheel",
    linkLabel: "Open the Domain Expansion Wheel",
  },
  {
    step: 4,
    title: "Spin your school",
    description:
      "Spin the student wheel and take the winner's school (Tokyo Jujutsu High or Kyoto Jujutsu High) as your own. Your character's classmate is the student you landed on.",
    href: "/jjk-student-wheel",
    linkLabel: "Open the JJK Student Wheel",
  },
  {
    step: 5,
    title: "Spin your mentor",
    description:
      "Spin the teacher wheel to find out who trains your sorcerer. A strong mentor with a weak grade makes for a fun underdog story.",
    href: "/jjk-teacher-wheel",
    linkLabel: "Open the JJK Teacher Wheel",
  },
  {
    step: 6,
    title: "Spin your rival or enemy",
    description:
      "Finish with the villain wheel (or the cursed spirit wheel) to pick who your character has to beat. For a bonus twist, spin the Mahoraga wheel for a shikigami partner.",
    href: "/jjk-villain-wheel",
    linkLabel: "Open the JJK Villain Wheel",
  },
] as const

export const JJK_WHEEL_OC_BUILDER_TIP =
  "Building characters with friends? Switch Action Mode to Elimination for the technique and Domain spins so no two people end up with the same power."

export const JJK_WHEEL_WHATS_ON_WHEEL = [
  "Jujutsu Kaisen characters — students, teachers, villains, and cursed spirits",
  "Grade filters — Grade 1 and Special Grade shortlists",
  "Cursed techniques and Domain Expansion concepts for creative prompts",
  "Custom entries with emoji and optional user-uploaded images",
  "Favorites and comparison shortlists before you spin",
  "Display modes — emoji + name, emoji only, or name only",
  "Popular templates — character, villain, spirit, Mahoraga, technique, domain, and team presets",
] as const

export const JJK_WHEEL_FEATURES_REAL = [
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
      "Save custom JJK wheels locally so the same shortlist is ready for the next challenge night.",
  },
] as const

export const JJK_WHEEL_CREATE_POINTS = [
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
      "Style tab palettes and Themes recolor wheel slices so your JJK wheel matches your stream or group branding.",
  },
  {
    title: "Save wheels",
    description:
      "Keep custom JJK wheels in My Wheels on this device for the next club meeting or watch party.",
  },
  {
    title: "Share wheels",
    description:
      "Open Social under the spinner and share the page link so friends can load the same tool on their device.",
  },
] as const

export const JJK_WHEEL_HOW_IT_WORKS = [
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

export const JJK_WHEEL_OPTIONS_GUIDE = [
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

export const JJK_WHEEL_USE_CASES_CONTENT = [
  {
    title: "Character challenges",
    description:
      "Assign a random sorcerer for drawing prompts, cosplay inspiration, or a no-repeat watch-party challenge.",
  },
  {
    title: "Team drafts",
    description:
      "Use Elimination with the team template to fill roster slots one spin at a time so every pick stays visible.",
  },
  {
    title: "Technique & Domain prompts",
    description:
      "Spin cursed techniques or Domain Expansions for writing, roleplay, or edit ideas without picking a character.",
  },
  {
    title: "Group debates",
    description:
      "Settle favorite-character arguments with a shared screen spin so the pool and result are transparent.",
  },
] as const

export const JJK_WHEEL_WHY_POINTS = [
  {
    title: "Visible fairness",
    description:
      "Everyone sees the enabled list and equal slices before the pointer stops—ideal for groups and streams.",
  },
  {
    title: "Franchise-focused templates",
    description:
      "Stay inside Jujutsu Kaisen instead of scrolling a huge all-anime database.",
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

export const JJK_WHEEL_COMPARISON = [
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

export const JJK_WHEEL_EEAT_TIPS = [
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

export const JJK_WHEEL_CUSTOMIZE_STEPS = [
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

export const JJK_WHEEL_FAQ_ITEMS = [
  { question: "What is JJK Spin the Wheel?", answer: "It is a free fan-made randomizer preloaded with 61 Jujutsu Kaisen characters, plus separate templates for 12 cursed techniques, 8 Domain Expansions, and 10 Ten Shadows shikigami." },
  { question: "How do I make my own JJK character with the spin wheel?", answer: "Spin one trait at a time: grade, cursed technique, Domain Expansion, school, mentor, and rival. The Build Your Own JJK Character section on this page links to the right template for each spin." },
  { question: "Can I spin for a random cursed technique or Domain Expansion?", answer: "Yes. Open the Cursed Technique Wheel or the Domain Expansion Wheel from the templates strip. Both use equal odds and contain techniques and domains rather than characters." },
  { question: "Is this the same as a JJK wheel of names?", answer: "It works the same way, but the list is already filled with Jujutsu Kaisen characters, so you do not have to type names. You can still paste your own list in the Text tab." },
  { question: "Does every entry have equal odds?", answer: "Yes. Every enabled entry appears once and has the same chance. Use the Weighted Wheel Spinner when you need unequal probabilities." },
  { question: "Can I add my own JJK characters or images?", answer: "Yes. Add a custom name and emoji, then upload an image from your device. Uploaded images stay part of your local wheel session." },
  { question: "Can the wheel avoid repeat winners?", answer: "Yes. Choose Elimination mode to disable the winner after each spin, which is useful for team drafts and challenges." },
  { question: "Is this an official Jujutsu Kaisen tool?", answer: JJK_WHEEL_DISCLAIMER },
] as const

/** @deprecated Prefer JJK_WHEEL_FEATURES_REAL for the guide article */
export const JJK_WHEEL_FEATURES = JJK_WHEEL_FEATURES_REAL

export const JJK_WHEEL_USE_CASE_GROUPS = [
  { category: "Challenges", items: ["Assign a character for an edit or drawing prompt", "Choose a cosplay inspiration", "Run a no-repeat character challenge"] },
  { category: "Fans and groups", items: ["Settle favorite-character debates", "Draft random JJK teams", "Pick discussion or quiz prompts"] },
  { category: "Creative prompts", items: ["Spin a cursed technique concept", "Choose a Domain Expansion", "Build a custom original-character wheel"] },
] as const

export const JJK_WHEEL_RELATED_TOOLS = [
  { label: "Pokémon Picker Wheel", href: "/pokemon-picker-wheel", description: "Spin characters from another popular fan universe." },
  { label: "Fortnite Picker Wheel", href: "/fortnite-picker-wheel", description: "Randomize Fortnite skins and challenges." },
  { label: "LoL Picker Wheel", href: "/lol-picker-wheel", description: "Pick a random League champion." },
  { label: "Random Name Picker", href: "/", description: "Build a wheel from any list of names." },
  { label: "Team Picker Wheel", href: "/spin-random-team-picker-wheel", description: "Split people into random teams." },
  { label: "Prize Wheel", href: "/prize-wheel-spinner", description: "Create an equal-odds prize spinner." },
  { label: "JJK Mahoraga Wheel", href: "/jjk-mahoraga-wheel", description: "Spin Mahoraga and Ten Shadows shikigami." },
] as const

export type JjkWheelLinkItem = {
  label: string
  href: string
  description: string
}
