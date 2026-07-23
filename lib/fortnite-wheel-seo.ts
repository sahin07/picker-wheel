import { HOME_SITE_URL } from "@/lib/home-seo"

export const FORTNITE_WHEEL_SITE_URL = HOME_SITE_URL

/** Canonical pillar path */
export const FORTNITE_WHEEL_PATH = "/fortnite-picker-wheel"

export const FORTNITE_WHEEL_URL = `${FORTNITE_WHEEL_SITE_URL}${FORTNITE_WHEEL_PATH}`

export const FORTNITE_WHEEL_OG_IMAGE_URL = `${FORTNITE_WHEEL_SITE_URL}/og/fortnite-picker-wheel.svg`

export const FORTNITE_WHEEL_PAGE_TITLE =
  "Fortnite Picker Wheel | Spin a Random Fortnite Wheel"

export const FORTNITE_WHEEL_PAGE_DESCRIPTION =
  "Spin the Fortnite Picker Wheel to randomly choose skins, weapons, landing spots, loadouts, or fun challenges. Customize your wheel and make every match more exciting."

export const FORTNITE_WHEEL_H1 = "Fortnite Picker Wheel"

export const FORTNITE_WHEEL_SHORT_TITLE = "Fortnite Picker Wheel"

export const FORTNITE_WHEEL_HERO_INTRO = `Looking for a new way to play Fortnite? Spin the Fortnite Picker Wheel to randomly choose skins, weapons, landing spots, challenges, or other custom options. Whether you're playing solo, with friends, or creating content for your audience, the wheel adds variety and keeps every match feeling different.`

export const FORTNITE_WHEEL_KEYWORDS = [
  "fortnite picker wheel",
  "fortnite picker",
  "fortnite wheel",
  "fortnite spinner",
  "fortnite spin wheel",
  "random fortnite picker",
  "fortnite wheel picker",
  "fortnite randomizer",
  "fortnite challenge wheel",
  "fortnite spin the wheel",
  "fortnite random wheel",
  "fortnite skin wheel",
  "fortnite weapon wheel",
  "fortnite landing spot wheel",
  "fortnite loadout wheel",
  "fortnite skins picker",
  "random fortnite skin",
  "fortnite game wheel",
  "fortnite decision wheel",
  "fortnite item picker",
  "fortnite challenge generator",
  "fortnite squad challenge",
] as const

export const FORTNITE_WHEEL_ON_THIS_PAGE = [
  { id: "fortnite-popular", label: "Popular Fortnite templates" },
  { id: "fortnite-spin-wheel", label: "Spin the Fortnite wheel" },
  { id: "fortnite-whats-on", label: "What you can put on the wheel" },
  { id: "fortnite-features", label: "Features on this page" },
  { id: "fortnite-create", label: "Create your own Fortnite wheel" },
  { id: "fortnite-how-it-works", label: "How the Fortnite wheel works" },
  { id: "fortnite-options", label: "How this tool's options work" },
  { id: "fortnite-use-cases", label: "Common ways to use a Fortnite picker wheel" },
  { id: "fortnite-why", label: "Why use a Fortnite picker wheel" },
  { id: "fortnite-comparison", label: "Picker wheel vs random generator" },
  { id: "fortnite-tips", label: "Streams, fairness & seasonal updates" },
  { id: "fortnite-customize", label: "How to customize your wheel" },
  { id: "fortnite-related", label: "Related tools" },
  { id: "fortnite-cluster", label: "Fortnite topic cluster" },
  { id: "fortnite-faq", label: "FAQ" },
] as const

export type FortniteWheelLinkItem = {
  label: string
  href: string
  description: string
}

/** Popular templates — links to live spoke routes. */
export const FORTNITE_WHEEL_POPULAR_TEMPLATES: FortniteWheelLinkItem[] = [
  {
    label: "Random Fortnite Skin",
    href: "/random-fortnite-skin-picker-wheel",
    description: "Spin the full locker set for a fair random outfit.",
  },
  {
    label: "Common Skins",
    href: "/fortnite-common-skins-picker-wheel",
    description: "Default and early Common rarity outfits only.",
  },
  {
    label: "Uncommon Skins",
    href: "/fortnite-uncommon-skins-picker-wheel",
    description: "Uncommon rarity spinner for lighter challenges.",
  },
  {
    label: "Rare Skins",
    href: "/fortnite-rare-skins-picker-wheel",
    description: "Rare rarity outfits on one focused wheel.",
  },
  {
    label: "Epic Skins",
    href: "/fortnite-epic-skins-picker-wheel",
    description: "Epic rarity spinner for mid-tier locker flex.",
  },
  {
    label: "Legendary Skins",
    href: "/fortnite-legendary-skins-picker-wheel",
    description: "Legendary outfits for high-rarity challenges.",
  },
  {
    label: "Mythic Skins",
    href: "/fortnite-mythic-skins-picker-wheel",
    description: "Mythic rarity spinner for elite locker picks.",
  },
  {
    label: "Collab Skins",
    href: "/fortnite-collab-skins-picker-wheel",
    description: "Marvel, DC, Star Wars, Dragon Ball, and event collabs.",
  },
  {
    label: "Weapon Wheel",
    href: "/fortnite-weapon-picker-wheel",
    description: "Random gun challenges for your next match.",
  },
  {
    label: "Landing Spot Wheel",
    href: "/fortnite-landing-spot-picker-wheel",
    description: "Spin a random POI drop location.",
  },
  {
    label: "Loadout Wheel",
    href: "/fortnite-loadout-picker-wheel",
    description: "Random weapon combos and loadout rules.",
  },
  {
    label: "Mythic Weapon Wheel",
    href: "/fortnite-mythic-weapon-picker-wheel",
    description: "Mythic gun challenges for special modes.",
  },
  {
    label: "Vehicle Wheel",
    href: "/fortnite-vehicle-picker-wheel",
    description: "Cars, boats, choppers, and movement rules.",
  },
  {
    label: "Duo Challenge Wheel",
    href: "/fortnite-duo-challenge-picker-wheel",
    description: "House rules for duo nights.",
  },
  {
    label: "Squad Challenge Wheel",
    href: "/fortnite-squad-challenge-picker-wheel",
    description: "Team challenges for four-stacks.",
  },
  {
    label: "Emote Wheel",
    href: "/fortnite-emote-picker-wheel",
    description: "Random dance and emote challenges.",
  },
  {
    label: "Loot Challenge Wheel",
    href: "/fortnite-loot-challenge-picker-wheel",
    description: "Chest rules and loot constraints.",
  },
  {
    label: "Item Picker",
    href: "/fortnite-item-picker-wheel",
    description: "Random guns, heals, and loot items.",
  },
  {
    label: "Decision Wheel",
    href: "/fortnite-decision-picker-wheel",
    description: "Tactical calls—push, rotate, third party.",
  },
]

export const FORTNITE_WHEEL_CREATE_POINTS = [
  {
    title: "Add custom entries",
    description:
      "Type skins, weapons, POIs, or house rules in the Text tab—one per line—or add manual slices from the Inputs panel.",
  },
  {
    title: "Choose favorite skins",
    description:
      "Heart outfits into Favorites and reopen them from the sidebar for quick shortlists before you spin.",
  },
  {
    title: "Add weapons & challenges",
    description:
      "Open Weapon, Landing Spot, Loadout, or Duo/Squad challenge templates—or build your own challenge wheel from scratch.",
  },
  {
    title: "Customize colors",
    description:
      "Style tab palettes and Themes recolor wheel slices so your Fortnite game wheel matches stream branding.",
  },
  {
    title: "Save wheels",
    description:
      "Keep custom Fortnite wheels in My Wheels on this device for the next stream or party night.",
  },
  {
    title: "Share wheels",
    description:
      "Open Social under the spinner and use Share My Wheel so friends can load the same list on their device.",
  },
] as const

export const FORTNITE_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Rarity filters",
    description:
      "Choose All or a single rarity (Common through Mythic) in the Inputs list. The wheel rebuilds with only matching skins—ideal for Legendary-only challenges or collab nights.",
  },
  {
    title: "Display Options & Show Title",
    description:
      "In the Style tab, pick Emoji & Name, Emoji Only, or Name Only for slice labels. Toggle Show title to show or hide the wheel heading above the spinner.",
  },
  {
    title: "Favorites",
    description:
      "Tap the heart on any skin in the list or open Favorites from the sidebar header (heart icon). Starred outfits stay in a Favorites modal for quick shortlists between streams.",
  },
  {
    title: "Skin Comparison",
    description:
      "Add up to four skins to Comparison from the list or the compare icon in the header. The Comparison modal shows outfits side by side with rarity, season, and enhanced metadata.",
  },
  {
    title: "Preview & Enhanced Details",
    description:
      "Preview opens one skin or the full wheel lineup. Enhanced Details shows rarity context, season, collaboration tags, and sample metadata for trivia or stream banter.",
  },
  {
    title: "Collection Stats",
    description:
      "Open the Stats sub-tab under Inputs for rarity distribution counts, collaboration breakdown (Marvel, DC, Star Wars, anime), and a summary of your recent spin results.",
  },
  {
    title: "Manual vs AI",
    description:
      "Manual lists every skin with checkboxes, search, shuffle, and add-random. AI suggests sets from your preferences, answers locker questions, and can auto-fill the wheel from chat prompts.",
  },
  {
    title: "Action Mode & Game Mode",
    description:
      "Normal keeps every skin after a spin. Elimination removes the winner for multi-round picks (synced with Remove winner in Manage). Manual lets you pick an outfit without spinning. Game Mode on the wheel mirrors the same setting.",
  },
  {
    title: "Text tab (bulk skins)",
    description:
      "Paste one skin name per line to enable matching catalog outfits. Export your current list, load what's on the wheel, or import a stream challenge roster in seconds.",
  },
  {
    title: "Style, Palettes & Themes",
    description:
      "Style sets display mode and show title. Color palettes recolor wheel slices; Themes unlock visual styles under the spinner (earn more through Achievements).",
  },
  {
    title: "Other Options (sound & spin)",
    description:
      "Other Options toggles confetti and spin sound, adjusts spinning duration and speed, enables random initial angle, and opens fullscreen or global Settings.",
  },
  {
    title: "Shuffle, Sort & Manage",
    description:
      "Shuffle randomizes slice order from the header. Manage menu covers Sort Z–A, remove duplicates, delete blanks, clear all, and Remove winner (synced with Elimination).",
  },
  {
    title: "Results & Spin History",
    description:
      "Results (top-left of the wheel) opens the last five winners with emoji and name. Spin History in the sidebar header tracks past spins with a badge count.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips under the wheel open Achievements (points and unlocks), Analytics (spin breakdowns), Social (profile and sharing), and Games (bingo and challenge modes).",
  },
  {
    title: "Wheel controls",
    description:
      "Mute toggles whoosh and win sounds. Fullscreen expands the spinner. STOP ends a spin early and locks in the slice at the pointer. Click the wheel face or Spin to start.",
  },
] as const

export const FORTNITE_WHEEL_WHATS_ON_WHEEL = [
  "Fortnite skins from Common through Mythic rarity, plus collab and event outfits",
  "Challenge entries — weapons, landing spots, loadouts, vehicles, emotes, and loot rules",
  "Custom text — paste POIs, gun types, or house rules one per line in the Text tab",
  "Favorites and comparison shortlists before you spin",
  "Display modes — emoji + name, emoji only, or name only for phone and TV",
  "Popular templates — rarity spokes, weapon wheel, landing spot, and challenge hub presets",
] as const

export const FORTNITE_WHEEL_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive wheel sits above this guide. Load a template or the full catalog and spin without leaving the page.",
  },
  {
    title: "Rarity and template filters",
    description:
      "Switch Common–Mythic, open challenge templates, or mix catalog skins with custom entries from the Inputs sidebar.",
  },
  {
    title: "Favorites, comparison & skin details",
    description:
      "Heart outfits, compare shortlists side by side, and open details for rarity, season, and collection stats.",
  },
  {
    title: "Elimination & Results history",
    description:
      "Remove winners across rounds for locker drafts, then review the last five spins from Results or Spin History.",
  },
  {
    title: "Text, Style & Sound",
    description:
      "Bulk-edit lists, recolor slices, toggle confetti and spin sounds, and go fullscreen for streams.",
  },
  {
    title: "Achievements, Analytics, Social & Games",
    description:
      "Feature chips open achievements, spin analytics, Social sharing, and bingo-style game modes.",
  },
  {
    title: "My Wheels on this device",
    description:
      "Save custom Fortnite wheels locally so the same skin set or challenge list is ready next session.",
  },
] as const

export const FORTNITE_WHEEL_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Choose your list",
    description:
      "Load all skins, pick a rarity template, or open a weapon, landing, or challenge spoke—or paste custom entries.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Filter outfits, set display mode, favorite shortlists, enable elimination, and tune colors from Style.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click Spin or tap the wheel so everyone sees a fair random skin, weapon, POI, or challenge land live.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Wear the skin, follow the challenge, remove the winner for the next round, or share via Social.",
  },
] as const

export const FORTNITE_WHEEL_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Pick a template or build a list",
    description:
      "Tap a Popular Fortnite template, filter by rarity, or paste weapons and POIs in the Text tab.",
  },
  {
    step: 2,
    title: "Tune fairness and style",
    description:
      "Enable elimination, remove duplicates in Manage, set colors, and use fullscreen for squad or stream display.",
  },
  {
    step: 3,
    title: "Spin and review",
    description:
      "Spin once, check Results history, open skin details, and remove winners when you need unique picks.",
  },
  {
    step: 4,
    title: "Save or share",
    description:
      "Keep wheels in My Wheels on this device. Open Social under the spinner to share your wheel with friends.",
  },
] as const

export const FORTNITE_WHEEL_USE_CASES_CONTENT = [
  {
    title: "Random Skin Challenge",
    description:
      "Pick a different skin every game. Load the full catalog or a rarity template, spin once, and wear whatever lands—perfect for locker flex and stream accountability.",
  },
  {
    title: "Random Weapon Challenge",
    description:
      "Limit yourself to randomly selected weapons. Open the Weapon Wheel or add gun types in the Text tab so every match uses a fair gun rule.",
  },
  {
    title: "Landing Spot Challenge",
    description:
      "Randomly decide where to land each match. The Landing Spot Wheel loads named POIs so squads stop arguing about drop locations.",
  },
  {
    title: "Stream Challenges",
    description:
      "Create fun challenges for YouTube or Twitch—spin live on stream, use elimination rounds, or stack emote and loot templates for viewer engagement.",
  },
  {
    title: "Playing With Friends",
    description:
      "Use the wheel for dares, squads, and custom rules. Duo and Squad challenge templates set house rules everyone sees before the bus launches.",
  },
] as const

export const FORTNITE_WHEEL_WHY_POINTS = [
  {
    title: "Keeps gameplay fresh",
    description:
      "Skins, weapons, landing spots, and loot rules change every spin so matches never feel like the same routine.",
  },
  {
    title: "Adds fun challenges",
    description:
      "Turn locker picks, gun limits, and drop spots into mini-games with elimination mode and ready-made templates.",
  },
  {
    title: "Great for content creators",
    description:
      "Streamers spin on camera so chat trusts the result—ideal for Fortnite challenge wheels and random Fortnite picker content.",
  },
  {
    title: "Easy to customize",
    description:
      "Add or remove entries, bulk-edit in the Text tab, favorite shortlists, and swap color palettes in seconds.",
  },
  {
    title: "Works on mobile and desktop",
    description:
      "Spin in any modern browser on phone, tablet, or TV—no app install required.",
  },
  {
    title: "Free to use",
    description:
      "No signup wall for the core spinner. Save wheels locally in My Wheels when you want them again.",
  },
] as const

export const FORTNITE_WHEEL_COMPARISON = [
  {
    aspect: "Experience",
    wheel: "Interactive spinning everyone can watch live",
    generator: "Instant random result with one click",
  },
  {
    aspect: "Streams & groups",
    wheel: "Great for live streams, squads, and parties",
    generator: "Fast for solo use when you only need a quick pick",
  },
  {
    aspect: "Customization",
    wheel: "Add skins, weapons, POIs, and custom challenge rules",
    generator: "Usually fixed options with little editing",
  },
  {
    aspect: "Engagement",
    wheel: "More engaging—a shared moment around the spin",
    generator: "Simpler interface, less visual buildup",
  },
] as const

export const FORTNITE_WHEEL_EEAT_TIPS = [
  {
    title: "Creative gameplay",
    description:
      "Use the wheel for unique match challenges—one weapon type only, random landing at a POI, or loot rules from the Loot Challenge template. Stack templates (land here + use this gun) for layered runs.",
  },
  {
    title: "Streaming and videos",
    description:
      "Creators spin on stream so viewers see a fair pick. Pair fullscreen mode, Results history, and elimination rounds for multi-segment YouTube or Twitch segments.",
  },
  {
    title: "Custom wheels",
    description:
      "Build wheels with current weapons, favorite skins, or house rules in the Text tab. Save in My Wheels and share via Social when friends want the same list.",
  },
  {
    title: "Fairness",
    description:
      "Every entry on the wheel has an equal chance when it appears once. Duplicates in Manage increase odds for that slice—remove duplicates if you want strict fairness.",
  },
  {
    title: "Seasonal updates",
    description:
      "Keep this pillar evergreen and refresh spoke pages (landing spots, weapons, collabs) when a new Fortnite season drops—no need to rewrite the whole hub every patch.",
  },
] as const

export const FORTNITE_WHEEL_RELATED_TOOLS: FortniteWheelLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The main hub for custom name, prize, and decision wheels.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split players into fair teams for sports and classrooms.",
  },
  {
    label: "Pokemon Picker Wheel",
    href: "/pokemon-picker-wheel",
    description: "Draw a Pokemon for teams, battles, or challenges.",
  },
  {
    label: "Minecraft Mob Wheel",
    href: "/minecraft-mob-wheel",
    description: "Random Minecraft mobs for survival and mini-games.",
  },
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Pick random numbers for draft slots or score challenges.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Quick fair yes/no decisions between matches.",
  },
  {
    label: "Random Name Picker",
    href: "/",
    description: "Spin custom names, prizes, or lineup ideas.",
  },
  {
    label: "Image Picker Wheel",
    href: "/image-picker",
    description: "Spin custom images for any game or giveaway.",
  },
]

export const FORTNITE_WHEEL_FAQ = [
  {
    question: "What is a Fortnite Picker Wheel?",
    answer:
      "A Fortnite Picker Wheel is a free online spinner that randomly chooses skins, weapons, landing spots, loadouts, or challenge rules from the entries you enable. Spin live for streams, squads, and custom games.",
  },
  {
    question: "Can I create my own Fortnite wheel?",
    answer:
      "Yes. Add custom entries in the Text tab, pick a ready-made template, or mix catalog skins with your own weapons and POIs. Save the result in My Wheels on this device.",
  },
  {
    question: "Can I add or remove skins and weapons?",
    answer:
      "Yes. Toggle skins in the Inputs list, open a Weapon or Landing Spot template, or paste names one per line in the Text tab. Remove slices anytime or use Clear all in Manage.",
  },
  {
    question: "Can I make a landing spot wheel?",
    answer:
      "Yes. Open the Landing Spot Wheel template at /fortnite-landing-spot-picker-wheel or paste POI names in the Text tab to build your own drop-location spinner.",
  },
  {
    question: "Does every option have an equal chance?",
    answer:
      "When each entry appears once on the wheel, every option has an equal chance. Duplicate entries increase odds for that slice—use Remove duplicates in Manage for strict fairness.",
  },
  {
    question: "Can I save my custom Fortnite wheel?",
    answer:
      "Yes. Custom wheels stay in My Wheels on this device so you can reopen the same skin set, weapon list, or challenge rules later.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The Fortnite Picker Wheel runs in mobile and tablet browsers—spin, fullscreen, and save wheels without installing an app.",
  },
  {
    question: "Is the Fortnite Picker Wheel free?",
    answer:
      "Yes. The core spinner is free with no signup required. Optional saves stay on this device via My Wheels.",
  },
] as const

export const FORTNITE_WHEEL_FAQ_ITEMS = FORTNITE_WHEEL_FAQ

export const FORTNITE_WHEEL_CLUSTER_LINKS: FortniteWheelLinkItem[] = [
  {
    label: "Random Fortnite Skin",
    href: "/random-fortnite-skin-picker-wheel",
    description: "Full catalog on one fair spinner.",
  },
  {
    label: "Legendary Skins Wheel",
    href: "/fortnite-legendary-skins-picker-wheel",
    description: "High-rarity locker challenges only.",
  },
  {
    label: "Mythic Skins Wheel",
    href: "/fortnite-mythic-skins-picker-wheel",
    description: "Elite rarity outfits for stream flex.",
  },
  {
    label: "Collab Skins Wheel",
    href: "/fortnite-collab-skins-picker-wheel",
    description: "Marvel, DC, Star Wars, and event collabs.",
  },
  {
    label: "Epic Skins Wheel",
    href: "/fortnite-epic-skins-picker-wheel",
    description: "Mid-tier rarity spinner for squad nights.",
  },
  {
    label: "Rare Skins Wheel",
    href: "/fortnite-rare-skins-picker-wheel",
    description: "Rare rarity outfits on one focused wheel.",
  },
  {
    label: "Weapon Wheel",
    href: "/fortnite-weapon-picker-wheel",
    description: "Random gun type challenges.",
  },
  {
    label: "Landing Spot Wheel",
    href: "/fortnite-landing-spot-picker-wheel",
    description: "Fair random drop locations.",
  },
  {
    label: "Loot Challenge Wheel",
    href: "/fortnite-loot-challenge-picker-wheel",
    description: "Chest rules and loot constraints.",
  },
  {
    label: "Challenge Wheel Hub",
    href: "/fortnite-challenge-picker-wheel",
    description: "All weapon, duo, squad, and loot templates.",
  },
  {
    label: "Item Picker",
    href: "/fortnite-item-picker-wheel",
    description: "Random guns, heals, and loot items.",
  },
  {
    label: "Decision Wheel",
    href: "/fortnite-decision-picker-wheel",
    description: "Tactical calls—push, rotate, third party.",
  },
  {
    label: "LoL Champions Picker",
    href: "/lol-picker-wheel",
    description: "Random League champion for draft chaos.",
  },
]

export const FORTNITE_WHEEL_ARTICLE_TITLE = "Spin the Fortnite Wheel"

export const FORTNITE_WHEEL_ARTICLE_INTRO = [
  `A Fortnite Picker Wheel turns skins, weapons, landing spots, loadouts, and challenges into one interactive spinner. Instead of debating rules or drop locations, you spin so everyone sees a fair random pick land live.`,
  `Filter skins by Common through Mythic rarity, open weapon or landing templates, favorite outfits, compare shortlists, eliminate winners across rounds, and save wheels you reuse every stream or party.`,
  `Searchers looking for a fortnite picker, fortnite wheel, random fortnite picker, or fortnite challenge wheel land here for skins, guns, POIs, and custom house rules without host bias.`,
] as const
