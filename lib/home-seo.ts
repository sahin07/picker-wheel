export const HOME_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://spinifywheel.com"

export const HOME_PAGE_TITLE =
  "Random Name Wheel Picker | Spin the Wheel Online Free"

export const HOME_PAGE_DESCRIPTION =
  "Spin the wheel online for free with our random name wheel picker. Create custom wheels, add names or options, save your wheels, and make fair random choices in seconds."

export const HOME_H1 =
  "Random Name Wheel Picker – Spin the Wheel Online for Free"

/** Minimal chrome title above the wheel (not the SEO H1 — competitor pattern). */
export const HOME_SHORT_TITLE = "Random Name Wheel Picker"

export const HOME_HERO_INTRO =
  "Need help making a random choice? Enter your own names, numbers, prizes, or ideas, then spin the wheel to instantly pick a random winner. Whether you're organizing a classroom activity, hosting a giveaway, choosing teams, or making everyday decisions, our free random name wheel picker makes the process quick, fair, and fun."

/** Discovery / marketing sections (above the long-form article) */
export const HOME_QUICK_FEATURES = [
  {
    title: "Spin the wheel in seconds",
    description:
      "Open the page, add your options, and use the spinning wheel right away—no signup and no install.",
  },
  {
    title: "Create your own custom wheel",
    description:
      "Build a custom spin wheel with names, prizes, challenges, or any list you need for a fair random picker.",
  },
  {
    title: "Unlimited entries",
    description:
      "Add as many labels as you want for classroom lists, giveaway entries, team drafts, or game night prompts.",
  },
  {
    title: "Mobile-friendly wheel spinner",
    description:
      "Use the same random name wheel picker on phone, tablet, or desktop for parties, streams, and quick decisions.",
  },
  {
    title: "Save wheels on this device",
    description:
      "Keep your wheels in My Wheels so you can reopen a lucky wheel, decision wheel, or name list later.",
  },
  {
    title: "Fair random selection",
    description:
      "Each enabled slice gets a chance when you spin the wheel online, so winners feel unbiased and transparent.",
  },
] as const

export type HomeLinkItem = {
  label: string
  href: string
  description: string
}

/** Live routes only — popular tool cards */
export const HOME_POPULAR_WHEELS: HomeLinkItem[] = [
  {
    label: "Random Name Wheel Picker",
    href: "/",
    description: "Spin a wheel of names for classrooms, parties, and giveaways.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-no-picker-wheel",
    description: "A simple decision wheel when you need a quick yes or no.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Pick a random letter for word games and writing prompts.",
  },
  {
    label: "Number Wheel",
    href: "/number-picker-wheel",
    description: "Draw a random number from a range for raffles and games.",
  },
  {
    label: "Country Wheel",
    href: "/country-wheel",
    description: "Spin for a random country for travel ideas or quizzes.",
  },
  {
    label: "Color Wheel",
    href: "/color-picker-wheel",
    description: "Pick a random color for design, art, or creative challenges.",
  },
  {
    label: "Image Picker",
    href: "/image-picker-wheel",
    description: "Spin photos and images for visual choices and classrooms.",
  },
  {
    label: "Team Picker",
    href: "/team-picker",
    description: "Split names into random teams for sports and group work.",
  },
  {
    label: "Pokemon Wheel",
    href: "/pokemon-wheel",
    description: "Pick a random Pokémon for challenges and game nights.",
  },
  {
    label: "NBA Teams Wheel",
    href: "/nba-wheel",
    description: "Spin for a random NBA team for fantasy and watch parties.",
  },
  {
    label: "MLB Teams Wheel",
    href: "/mlb-wheel",
    description: "Choose a random MLB team for drafts and sports games.",
  },
  {
    label: "Custom Spin Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Create a branded custom spin wheel and share a link.",
  },
]

export const HOME_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Add your options",
    description:
      "Type names, prizes, or ideas into the list—or paste a bulk list—to build your wheel to spin.",
  },
  {
    step: 2,
    title: "Customize the wheel",
    description:
      "Tune colors, sounds, and style so your custom spin wheel matches the classroom, stream, or giveaway vibe. Use fullscreen next to the volume icon when presenting.",
  },
  {
    step: 3,
    title: "Spin the wheel",
    description:
      "Click spin and watch the spinning wheel land on a random winner in seconds.",
  },
  {
    step: 4,
    title: "Use the result",
    description:
      "Celebrate the pick, remove a winner if you want elimination mode, then spin again for the next round.",
  },
] as const

export const HOME_WHY_POINTS = [
  {
    title: "Instant spinning",
    description:
      "The interactive wheel is ready above the fold—spin without digging through menus.",
  },
  {
    title: "Fully customizable",
    description:
      "Change labels, colors, and settings to create a spin wheel custom to your list.",
  },
  {
    title: "Unlimited entries",
    description:
      "Grow from a short decision wheel to a long wheel spin names list for big groups.",
  },
  {
    title: "Mobile friendly",
    description:
      "Run the same wheel spinner on phones for in-person giveaways and classroom desks.",
  },
  {
    title: "Save your wheels",
    description:
      "Reopen saved wheels on this device so favorite lists stay ready to spin.",
  },
  {
    title: "Share with friends",
    description:
      "Point people to the tool or a custom wheel link so everyone spins the same picker.",
  },
  {
    title: "Random and unbiased selection",
    description:
      "Results come from the spin itself so participants can see a transparent random picker.",
  },
  {
    title: "No installation required",
    description:
      "Use spin the wheel online in the browser—nothing to download for guests or students.",
  },
] as const

export const HOME_USE_CASES = [
  "Pick classroom students fairly for questions, groups, or helpers",
  "Choose giveaway winners from a list of entrants",
  "Select random teams for sports, classrooms, or workshops",
  "Choose restaurants or meal ideas when nobody can decide",
  "Run game challenges for streams, parties, and board-game nights",
  "Pick workout routines or daily habit prompts",
  "Make everyday decisions with a quick decision wheel",
  "Host prize drawings and raffles with a lucky wheel",
  "Start meetings with icebreakers from a custom list",
  "Play family games with names, dares, or prompts on a spinning wheel",
] as const

/** Main article H2 under the intro */
export const HOME_ARTICLE_TITLE = "Random Name Wheel Picker: Spin the Wheel Online for Any List"

export const HOME_ARTICLE_INTRO = [
  "The Random Name Wheel Picker on this page is a free online spin the wheel tool for any list you build. Add student names, giveaway entries, prizes, prompts, or everyday choices, then spin once to get a clear, visible winner—no account and no install.",
  "Unlike a fixed sports roster or a single Yes/No wheel, this picker wheel is open-ended. You decide what sits on each slice. That makes it a practical decision wheel for classrooms, parties, streams, meetings, and family games where the options change every day.",
  "A spinning wheel works because everyone can see the same options and the same result. When you need a random name picker, a lucky wheel for a raffle, or a custom spin wheel for challenges, the tool above turns a messy list into one fair spin.",
] as const

export const HOME_WHATS_ON_WHEEL = [
  "Your own labels — names, numbers, prizes, teams, restaurants, dares, or any text you type or paste",
  "Weighted slices — give some options a higher chance when you need tiered odds",
  "Hidden or disabled entries — keep someone out of the next spin without deleting the list",
  "Colors and style — match classroom, party, or brand vibes from the Style tab",
  "Quick templates — load ready lists (Yes/No, numbers, days, colors, and more) then edit",
] as const

export const HOME_FEATURES_REAL = [
  {
    title: "Instant spin",
    description:
      "The interactive wheel sits above this article. Add options and spin without leaving the page.",
  },
  {
    title: "List, Text, and Style tabs",
    description:
      "Edit one by one, paste a bulk list (including weight syntax), and customize colors in one panel.",
  },
  {
    title: "Weighted random picks",
    description:
      "Adjust weights and see probability percentages so raffles and “rare” prizes stay transparent.",
  },
  {
    title: "Remove winner after spin",
    description:
      "Turn on elimination-style behavior so each winner leaves the wheel—ideal for unique classroom helpers or multi-prize giveaways.",
  },
  {
    title: "Multi-winner draw",
    description:
      "Pick several winners in one go from Other Options when you need more than a single spin result.",
  },
  {
    title: "CSV and text import / export",
    description:
      "Bring in a spreadsheet list or export your current options for backup and reuse.",
  },
  {
    title: "Results history",
    description:
      "Review recent spin results on this page so you can confirm who already won.",
  },
  {
    title: "Sound, mute, and confetti",
    description:
      "Celebrate wins with optional sound and confetti, or mute for quiet classrooms.",
  },
  {
    title: "Fullscreen mode",
    description:
      "Tap the expand icon next to the volume control to fill the screen with the wheel—ideal for classrooms, parties, and projectors. Press Escape or the minimize icon to exit.",
  },
  {
    title: "My Wheels on this device",
    description:
      "Create, rename, and switch local wheels so different lists stay ready without rebuilding them.",
  },
  {
    title: "Games modes",
    description:
      "Use Bingo, Memory, Collection, and Sequence modes from the header when you want spin-based play beyond a single pick.",
  },
] as const

export const HOME_USE_CASES_DETAILED = [
  {
    title: "Classroom student picker",
    description:
      "Spin for who answers next, who presents, or who joins a group—fair and visible to the whole class.",
  },
  {
    title: "Giveaway and raffle draws",
    description:
      "Paste entrant names or ticket numbers, spin once, and announce a transparent random winner.",
  },
  {
    title: "Team and group selection",
    description:
      "Build a name list and spin to assign order, captains, or partners. For splitting into many teams, also try Team Picker.",
  },
  {
    title: "Watch parties and streams",
    description:
      "Let the wheel choose challenges, dares, or who picks the next game while viewers watch the spin.",
  },
  {
    title: "Everyday decisions",
    description:
      "Restaurants, chores, workout moves, or movie night options—use it as a quick decision wheel when nobody can choose.",
  },
  {
    title: "Meetings and icebreakers",
    description:
      "Load prompts or names and spin to start discussion without calling on the same people every time.",
  },
] as const

export const HOME_CUSTOMIZE_STEPS = [
  {
    step: 1,
    title: "Build the list",
    description:
      "Use Manual Input to add options, paste a bulk list in the Text tab, or start from a Quick Template above.",
  },
  {
    step: 2,
    title: "Tune fairness and style",
    description:
      "Set weights, hide entries, pick colors, and adjust spin settings (speed, duration, mystery mode, remove winner). Use fullscreen beside the volume icon for classroom or party display.",
  },
  {
    step: 3,
    title: "Spin and review",
    description:
      "Hit spin, read the winner, check Results history, and spin again—or remove the winner for elimination rounds.",
  },
  {
    step: 4,
    title: "Save or share the right way",
    description:
      "Keep lists in My Wheels on this device. For a shareable link with the exact options baked in, use Create Custom Wheel.",
  },
] as const

/** Live routes only — related tools for the article */
export const HOME_RELATED_TOOLS: HomeLinkItem[] = [
  {
    label: "Yes or No Wheel",
    href: "/yes-no-picker-wheel",
    description: "Binary decisions when you only need yes or no.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Random letters for word games and writing prompts.",
  },
  {
    label: "Number Wheel",
    href: "/number-picker-wheel",
    description: "Draw a number from a range for raffles and games.",
  },
  {
    label: "Team Picker",
    href: "/team-picker",
    description: "Split names into random teams for class or sports.",
  },
  {
    label: "Country Wheel",
    href: "/country-wheel",
    description: "Random countries for travel ideas and quizzes.",
  },
  {
    label: "Color Wheel",
    href: "/color-picker-wheel",
    description: "Random colors for design and creative challenges.",
  },
  {
    label: "NBA Teams Wheel",
    href: "/nba-wheel",
    description: "Ready-made NBA team picker for fantasy and parties.",
  },
  {
    label: "MLB Teams Wheel",
    href: "/mlb-wheel",
    description: "Ready-made MLB team picker for drafts and watch nights.",
  },
  {
    label: "Pokemon Wheel",
    href: "/pokemon-wheel",
    description: "Random Pokémon for challenges and game nights.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable custom spin wheel with its own link.",
  },
]

export const HOME_POPULAR_CATEGORIES: HomeLinkItem[] = [
  {
    label: "Giveaway Wheels",
    href: "/spin-wheels/tools-wheel-pickers",
    description: "Name and number pickers for prize draws and raffles.",
  },
  {
    label: "Classroom Wheels",
    href: "/spin-wheels/tools-wheel-pickers",
    description: "Student pickers, letters, and fair classroom randomizers.",
  },
  {
    label: "Gaming Wheels",
    href: "/spin-wheels/video-games-wheel-pickers",
    description: "Fortnite, Pokémon, LoL, and other game pickers.",
  },
  {
    label: "Sports Wheels",
    href: "/spin-wheels/sports-wheel-pickers",
    description: "NBA, MLB, and team tools for sports fans.",
  },
  {
    label: "Decision Wheels",
    href: "/yes-no-picker-wheel",
    description: "Yes/No and custom lists for everyday choices.",
  },
  {
    label: "Party Wheels",
    href: "/spin-wheels/all-wheels",
    description: "Fun spinners for icebreakers, games, and celebrations.",
  },
  {
    label: "Travel & World",
    href: "/spin-wheels/travel-world-wheel-pickers",
    description: "Country and state wheels for geography and trips.",
  },
  {
    label: "Random Generators",
    href: "/spin-wheels/all-wheels",
    description: "Browse every wheel picker available on the site.",
  },
]

export const HOME_ON_THIS_PAGE = [
  { id: "home-article-context", label: "What this Random Name Wheel Picker is for" },
  { id: "home-whats-on-wheel", label: "What you can put on the wheel" },
  { id: "home-features", label: "Features that work on this page" },
  { id: "home-use-cases", label: "Best ways to use it" },
  { id: "home-customize", label: "How to customize" },
  { id: "home-related-tools", label: "Related random picker wheels" },
  { id: "home-faq", label: "Common questions" },
] as const

export type HomeFaqItem = {
  question: string
  answer: string
}

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    question: "What is a random name wheel picker?",
    answer:
      "A random name wheel picker is an online spinning wheel that selects one option from your list—especially names for classrooms, parties, and giveaways. On this page you can also add numbers, prizes, or ideas, spin the wheel, and get a fair random winner.",
  },
  {
    question: "Is the wheel random?",
    answer:
      "Yes. Each spin lands on one of your enabled slices. Equal weights mean equal chance; if you raise a weight, that slice becomes more likely—and the list view shows probability percentages.",
  },
  {
    question: "How do I create a custom wheel?",
    answer:
      "Use the input panel above: add options, paste a bulk list in Text mode, or load a Quick Template. Adjust colors in Style, then spin. For a branded wheel with a shareable URL that includes your options, use Create Custom Wheel.",
  },
  {
    question: "Can I save my wheel?",
    answer:
      "Yes. Use My Wheels in the header to create, rename, and switch wheels saved on this device (browser local storage).",
  },
  {
    question: "Can I share my wheel?",
    answer:
      "You can send people to this Random Name Wheel Picker page to build the same kind of list. To share an exact option list via link, create a Custom Spin Wheel—those pages store the entries in a shareable URL.",
  },
  {
    question: "Does every entry have an equal chance?",
    answer:
      "With default equal weights, yes. Change weights when you need uneven odds (for example, common vs rare prizes). Disabled slices are skipped.",
  },
  {
    question: "Can I use it for giveaways?",
    answer:
      "Yes. Paste entrants, spin once, and announce the winner. Enable remove-winner / giveaway helpers for multi-prize draws so names do not repeat.",
  },
  {
    question: "Can I remove winners after each spin?",
    answer:
      "Yes. Use remove-winner / giveaway options so the winning slice leaves the wheel. That keeps classroom helpers and raffle prizes unique.",
  },
  {
    question: "How many entries can I add?",
    answer:
      "You can add a large list—from a few choices to long classroom or giveaway lists—using the List or Text tabs, including CSV/text import.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The spin wheel runs in mobile browsers, so you can use it in class, at a party, or during a live event from a phone or tablet.",
  },
]
