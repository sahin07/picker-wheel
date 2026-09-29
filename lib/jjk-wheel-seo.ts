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
  "The JJK wheel loads 61 Jujutsu Kaisen characters on one spinner: first-years like Yuji Itadori, Megumi Fushiguro, and Nobara Kugisaki, second-years like Maki Zenin, Toge Inumaki, and Panda, sorcerers like Satoru Gojo and Kento Nanami, and curses from Mahito and Jogo up to Ryomen Sukuna himself. Gojo gets exactly one slice, the same as Kokichi Muta, so a Special Grade pull is pure luck rather than a rigged favorite.",
  "Narrow the pool with the templates above the wheel. The Students template mixes Tokyo Jujutsu High with Kyoto Jujutsu High (Aoi Todo, Mai Zenin, Noritoshi Kamo, Momo Nishimiya, and Kasumi Miwa), which makes it a quick way to rerun the Goodwill Event with random teams. The Special Grade template is the short list for Gojo, Yuta, Sukuna, Kenjaku, and the disaster curses, while the Cursed Technique and Domain Expansion templates spin powers instead of people.",
  "Want a draft where nobody gets Gojo twice? Switch Action Mode to Elimination and each winner drops off the wheel until the roster is full. Leave it on Normal for one-off picks such as \"which character do I draw tonight\". The Results button keeps the pick order, which helps when a Discord server drafts sorcerers across several rounds.",
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
    title: "61 sorcerers and curses preloaded",
    description:
      "Tokyo and Kyoto students, teachers, Grade 1 sorcerers, Death Painting brothers, and disaster curses are ready without typing a single name.",
  },
  {
    title: "Grade and school filters",
    description:
      "Cut the pool to Special Grade, Grade 1, Tokyo Jujutsu High, Kyoto Jujutsu High, villains, or cursed spirits in one tap.",
  },
  {
    title: "Techniques, domains, and shikigami",
    description:
      "Separate entries for 12 cursed techniques, 8 Domain Expansions, and 10 Ten Shadows shikigami power the OC builder and power-roll challenges.",
  },
  {
    title: "Side-by-side compare",
    description:
      "Put Gojo, Sukuna, Yuta, and Kenjaku next to each other with their grade and role tags before you decide who stays on the wheel.",
  },
  {
    title: "No-repeat Elimination drafts",
    description:
      "Every drafted sorcerer leaves the wheel, so a four-player Goodwill Event draft never hands out the same student twice.",
  },
  {
    title: "Stream-ready spins",
    description:
      "Fullscreen, spin sound, and confetti make the Sukuna-or-Gojo reveal readable on Twitch, TikTok, or a Discord screen share.",
  },
  {
    title: "Saved JJK rosters",
    description:
      "Keep a Culling Game roster, a villains-only wheel, or your OC traits in My Wheels on this device for next week's session.",
  },
] as const

export const JJK_WHEEL_CREATE_POINTS = [
  {
    title: "Add manga-only or OC names",
    description:
      "Characters from later arcs or your own sorcerers go in through Inputs with a name and emoji; the Text tab accepts a pasted roster, one per line.",
  },
  {
    title: "Heart your main picks",
    description:
      "Favorite Yuji, Megumi, Nobara, and the rest of your go-to cast so a quick fan-favorites wheel is one click away.",
  },
  {
    title: "Start from a JJK preset",
    description:
      "Students, Villains, Cursed Spirits, Mahoraga / Ten Shadows, or Team Draft gives you a themed pool to edit instead of an empty wheel.",
  },
  {
    title: "Match the slices to your server",
    description:
      "Pick a Gojo-blue or Sukuna-red color palette in Style, or unlock a Theme, so the wheel fits your stream overlay or Discord.",
  },
  {
    title: "Keep it for the next arc",
    description:
      "Save a Shibuya Incident or Culling Game wheel in My Wheels so the same cast is loaded when your watch party continues.",
  },
  {
    title: "Send it to your group",
    description:
      "Share the page from the Social chip so every friend spins the same JJK wheel from their own phone.",
  },
] as const

export const JJK_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Pick your pool",
    description:
      "All 61 characters, only Kyoto students, only disaster curses, or only Domain Expansions—choose the template that matches your challenge.",
  },
  {
    step: 2,
    title: "Set the rules",
    description:
      "Toggle off anyone you have not reached in the anime yet, and turn on Elimination if the spin is for a no-repeat team draft.",
  },
  {
    step: 3,
    title: "Spin in front of everyone",
    description:
      "Hit Spin so the whole group watches the pointer slow down between Nanami and Mahito and nobody can claim the pick was chosen.",
  },
  {
    step: 4,
    title: "Play out the result",
    description:
      "Draw the sorcerer, add them to your team, or spin the next OC trait; Results keeps the order if you need to replay the draft.",
  },
] as const

export const JJK_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Category filters",
    description:
      "In Inputs, switch from All to Students, Teachers, Villains, Cursed Spirits, Grade 1, Special Grade, Techniques, or Domains and the JJK wheel redraws with only that group.",
  },
  {
    title: "Slice labels",
    description:
      "Style offers Emoji & Name (👊 Yuji Itadori), Emoji Only for a guessing game, or Name Only for a cleaner look with long names like Yoshinobu Gakuganji.",
  },
  {
    title: "Favorites",
    description:
      "The heart icon saves characters like Nanami or Todo to Favorites, which you can reopen from the sidebar header for a personal shortlist.",
  },
  {
    title: "Comparison",
    description:
      "Queue up to four entries—say Gojo, Sukuna, Yuta, and Kenjaku—and the compare window lines up their emoji and category tags.",
  },
  {
    title: "Preview",
    description:
      "Preview shows each entry's school (Tokyo or Kyoto), clan (Zenin, Gojo, Kamo, Inumaki), categories, and any image you uploaded.",
  },
  {
    title: "Collection Stats",
    description:
      "The Stats sub-tab counts how many students, villains, and curses are enabled and which sorcerers have come up most often.",
  },
  {
    title: "Manual vs AI",
    description:
      "Manual is a searchable checklist of all 61 characters with shuffle and add-random. AI can suggest a themed set, like \"only characters from the Shibuya arc\".",
  },
  {
    title: "Action Mode",
    description:
      "Normal leaves every sorcerer on the wheel. Elimination removes each winner (same as Remove winner in Settings). Manual lists picks under the wheel instead of removing them.",
  },
  {
    title: "Text tab",
    description:
      "Paste a list such as Yuji Itadori, Megumi Fushiguro, Nobara Kugisaki to turn those catalog entries on, or export the current JJK roster to reuse elsewhere.",
  },
  {
    title: "Palettes & Themes",
    description:
      "Palettes recolor the slices; Themes change the whole wheel style, and more of them unlock as you earn Achievements.",
  },
  {
    title: "Sound, confetti & fullscreen",
    description:
      "Other Options holds the spin sound, confetti on the winner, Analytics, fullscreen, and Settings shortcuts.",
  },
  {
    title: "Shuffle & Manage",
    description:
      "Shuffle scrambles the slice order so Gojo is not always next to Geto. Manage sorts, removes duplicates or blanks, and clears the list.",
  },
  {
    title: "Results & Spin History",
    description:
      "Results (top-left) lists the latest winners; Spin History in the sidebar keeps a longer log with a badge counter.",
  },
  {
    title: "Wheel controls",
    description:
      "Mute silences the spin, STOP ends a spin early, and clicking the wheel face starts a spin just like the Spin button.",
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
      "Gojo and Kokichi Muta get the same size slice, and chat can watch the whole spin, so nobody can say the streamer picked Sukuna on purpose.",
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
    wheel: "Grade, school, and villain filters plus your own OCs and images",
    generator: "Usually a fixed JJK list you cannot trim",
  },
  {
    aspect: "Best for",
    wheel: "Goodwill Event drafts, OC building, streams, watch parties",
    generator: "A quick solo \"which JJK character am I\" answer",
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
    title: "Trim to where you are in the story",
    description: "Anime-only watchers can switch off late-manga characters; manga readers can keep the full cast.",
  },
  {
    step: 2,
    title: "Add your sorcerers",
    description: "Put your OC, a fan-made technique, or a custom binding vow on the wheel, with your own art if you have it.",
  },
  {
    step: 3,
    title: "Give it a JJK look",
    description: "Choose emoji-only slices for a guess-the-sorcerer game, then pick a palette and theme for your stream.",
  },
  {
    step: 4,
    title: "Save the roster",
    description: "Store it in My Wheels or copy the Text list so your Discord can rerun the same draft next week.",
  },
] as const

export const JJK_WHEEL_FAQ_ITEMS = [
  { question: "What is JJK Spin the Wheel?", answer: "It is a free fan-made randomizer preloaded with 61 Jujutsu Kaisen characters, plus separate templates for 12 cursed techniques, 8 Domain Expansions, and 10 Ten Shadows shikigami." },
  { question: "How do I make my own JJK character with the spin wheel?", answer: "Spin one trait at a time: grade, cursed technique, Domain Expansion, school, mentor, and rival. The Build Your Own JJK Character section on this page links to the right template for each spin." },
  { question: "Can I spin for a random cursed technique or Domain Expansion?", answer: "Yes. Open the Cursed Technique Wheel or the Domain Expansion Wheel from the templates strip. Both use equal odds and contain techniques and domains rather than characters." },
  { question: "Is this the same as a JJK wheel of names?", answer: "It works the same way, but the list is already filled with Jujutsu Kaisen characters, so you do not have to type names. You can still paste your own list in the Text tab." },
  { question: "Is Gojo or Sukuna more likely to land?", answer: "No. Each enabled character takes one equal slice, so Gojo, Sukuna, and Kasumi Miwa all have the same odds. If you want Special Grades to be rarer, use the Weighted Wheel Spinner instead." },
  { question: "Can I add my own JJK characters or images?", answer: "Yes. Type the name of a late-manga character or your OC, pick an emoji, and upload fan art from your device. The image stays on your wheel in this browser." },
  { question: "Can the wheel avoid repeat winners?", answer: "Yes. Elimination mode takes each winner off the wheel, so in a team draft only one person can end up with Gojo or Yuji." },
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
