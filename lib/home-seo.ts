export const HOME_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://spinifywheel.com"

/** Pillar path for the Random Name Picker hub */
export const HOME_PATH = "/"

export const HOME_URL = `${HOME_SITE_URL}${HOME_PATH === "/" ? "/" : HOME_PATH}`

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
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
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

/** Grouped use cases — Classroom / Giveaways / Workplace / Home */
export const HOME_USE_CASE_GROUPS = [
  {
    title: "Classroom",
    items: [
      "Pick a student to answer or lead",
      "Set presentation order",
      "Choose reading turns",
      "Find quiz volunteers",
      "Assign group activity partners",
    ],
  },
  {
    title: "Giveaways",
    items: [
      "Select contest winners",
      "Run prize draws",
      "Pick social media giveaway winners",
      "Host lucky draws and raffles",
    ],
  },
  {
    title: "Workplace",
    items: [
      "Assign tasks fairly",
      "Choose meeting speakers",
      "Select team members for projects",
      "Start icebreaker activities",
    ],
  },
  {
    title: "Home & Friends",
    items: [
      "Rotate chores",
      "Pick movie night choices",
      "Decide on a restaurant",
      "Run family game turns",
    ],
  },
] as const

export const HOME_COMPARISON_INTRO =
  "Many people search for both a random name picker and a “wheel of names.” This page is built for name-first lists—classrooms, giveaways, and teams—while still working as a general custom wheel when you need other entries."

export const HOME_COMPARISON_ROWS = [
  {
    aspect: "Focus",
    namePicker: "Focused on picking names",
    wheelOfNames: "General-purpose wheel",
  },
  {
    aspect: "Best for",
    namePicker: "Great for classrooms",
    wheelOfNames: "Works for any list",
  },
  {
    aspect: "Setup",
    namePicker: "Easy to paste names",
    wheelOfNames: "Supports names and other entries",
  },
  {
    aspect: "Outcome",
    namePicker: "Optimized for winner selection",
    wheelOfNames: "More customizable overall",
  },
] as const

/** Product-type comparison — Random Name Picker vs general wheel spinner */
export const HOME_SPINNER_COMPARISON_INTRO =
  "A random name picker and a generic wheel spinner can look similar, but they solve different jobs. Use this page when the list is mostly people or entrants; use a broader spinner when the list is prizes, challenges, or mixed options."

export const HOME_SPINNER_COMPARISON_ROWS = [
  {
    aspect: "Primary job",
    namePicker: "Pick a person or entrant fairly",
    wheelSpinner: "Spin any custom list of options",
  },
  {
    aspect: "Typical inputs",
    namePicker: "Student names, giveaway entrants, volunteers",
    wheelSpinner: "Prizes, dares, tasks, yes/no, mixed labels",
  },
  {
    aspect: "Templates",
    namePicker: "Classroom, giveaway, Secret Santa, presentation order",
    wheelSpinner: "General quick lists (numbers, colors, days)",
  },
  {
    aspect: "When to choose it",
    namePicker: "Winner selection and fair turns for people",
    wheelSpinner: "Open-ended decisions and party games",
  },
] as const

export const HOME_EEAT_SECTIONS = [
  {
    id: "home-eeat-randomness",
    title: "How randomness works",
    body: "Each unique name on the wheel has an equal chance of being selected when weights are equal. If the same name is added more than once, it naturally has a higher chance because it appears on multiple slices. Raise or lower weights when you need uneven odds—and check the probability percentages in the list view.",
  },
  {
    id: "home-eeat-fairness",
    title: "Best practices for fair drawings",
    body: "Before spinning for a giveaway or classroom helper, scan for duplicate names if every person should have one equal chance. Remove blanks, disable anyone who already won when you need unique winners, and announce the result while everyone can see the wheel.",
  },
  {
    id: "home-eeat-when-not",
    title: "When not to use it",
    body: "This tool is ideal for games, classroom activities, casual giveaways, and low-stakes decisions. Official contests should always follow applicable laws and platform rules—use this spinner as a transparent helper, not as legal advice or a regulated lottery system.",
  },
] as const

export const HOME_WHY_BENEFITS = [
  {
    title: "Fair and unbiased",
    description: "Visible spins make picks feel transparent to the whole group.",
  },
  {
    title: "Fast selection",
    description: "Add names and spin in seconds—no setup ceremony.",
  },
  {
    title: "Easy to customize",
    description: "Edit colors, weights, mystery mode, and remove-winner behavior.",
  },
  {
    title: "Works on any device",
    description: "Phone, tablet, or desktop—same random name picker in the browser.",
  },
  {
    title: "No signup required",
    description: "Open the page and spin without creating an account.",
  },
  {
    title: "Unlimited spins",
    description: "Spin as often as you need for class periods, parties, or prize rounds.",
  },
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
  "Quick templates — load classroom, giveaway, Secret Santa, and other name lists from the strip under the title, then edit",
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
      "Use Manual Input to add options, paste a bulk list in the Text tab, or start from a Popular Name Picker Template under the title.",
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

/** Live routes only — related tools for the article (excludes this pillar page) */
export const HOME_RELATED_TOOLS: HomeLinkItem[] = [
  {
    label: "Number Picker Wheel",
    href: "/number-picker-wheel",
    description: "Draw a number from a range for raffles and games.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Random letters for word games and writing prompts.",
  },
  {
    label: "Yes or No Wheel",
    href: "/yes-or-no-wheel",
    description: "Binary decisions when you only need yes or no.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker",
    description: "Split names into random teams for class or sports.",
  },
  {
    label: "Color Wheel",
    href: "/color-picker-wheel",
    description: "Random colors for design and creative challenges.",
  },
  {
    label: "Image Picker",
    href: "/image-picker-wheel",
    description: "Spin photos and images for visual choices.",
  },
  {
    label: "Create Custom Wheel",
    href: "/create-custom-wheel-spinner",
    description: "Build a shareable custom spin wheel with its own link.",
  },
]

/** First-batch name-picker cluster spokes (EEAT-safe launch set) */
export const HOME_CLUSTER_LINKS: HomeLinkItem[] = [
  {
    label: "Classroom Name Picker",
    href: "/classroom-name-picker",
    description: "Fair student picks for questions, helpers, and turns.",
  },
  {
    label: "Giveaway Name Picker",
    href: "/giveaway-name-picker",
    description: "Transparent winner draws for contests and raffles.",
  },
  {
    label: "Secret Santa Name Picker",
    href: "/secret-santa-name-picker",
    description: "Random gift-exchange draws for holiday events.",
  },
  {
    label: "Presentation Order Picker",
    href: "/presentation-order-picker",
    description: "Decide who presents first without debate.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker",
    description: "Split names into random teams (existing tool).",
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
    href: "/yes-or-no-wheel",
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
  { id: "home-common-ways", label: "Common ways to use a name picker" },
  { id: "home-comparison", label: "Random Name Picker vs Wheel of Names" },
  { id: "home-spinner-comparison", label: "Random Name Picker vs Wheel Spinner" },
  { id: "home-eeat", label: "Fairness tips and best practices" },
  { id: "home-cluster", label: "Name picker cluster" },
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
    question: "What is a Random Name Picker?",
    answer:
      "A Random Name Picker is an online spinning wheel that selects one name (or option) from your list. On this page you can add classroom students, giveaway entrants, prizes, or ideas, spin the wheel, and get a fair random winner—no account required.",
  },
  {
    question: "Is every name equally likely to be selected?",
    answer:
      "Yes, when weights are equal. Each enabled slice has the same chance. If you add the same name more than once, or raise a weight, that entry becomes more likely—and the list view shows probability percentages.",
  },
  {
    question: "Can I paste a list of names?",
    answer:
      "Yes. Open the Text tab in the input panel, paste one name per line (or use bulk/CSV import), then spin. You can also tap a Popular Name Picker Template under the title and replace the sample names.",
  },
  {
    question: "Can I remove winners after each spin?",
    answer:
      "Yes. Turn on Remove Winner After Spin in Settings or Manage so the winning name leaves the wheel. That keeps classroom helpers and multi-prize giveaways unique.",
  },
  {
    question: "Can I save my name picker?",
    answer:
      "Yes. Use My Wheels in the header to create, rename, and switch wheels saved on this device (browser local storage).",
  },
  {
    question: "Can I share my custom wheel?",
    answer:
      "You can send people to this Random Name Picker page to build the same kind of list. To share an exact option list via link, create a Custom Spin Wheel—those pages store the entries in a shareable URL.",
  },
  {
    question: "Is this useful for classrooms?",
    answer:
      "Yes. Teachers use it to pick students for questions, reading turns, presentation order, quiz volunteers, and group activities. Fullscreen mode helps when projecting for the whole class.",
  },
  {
    question: "Can I use it for giveaways?",
    answer:
      "Yes. Paste entrants, spin once, and announce the winner. Enable remove-winner for multi-prize draws so names do not repeat. For official contests, follow applicable laws and platform rules.",
  },
  {
    question: "Does it work on mobile?",
    answer:
      "Yes. The spin wheel runs in mobile browsers, so you can use it in class, at a party, or during a live event from a phone or tablet.",
  },
  {
    question: "Is the Random Name Picker free?",
    answer:
      "Yes. You can add names, spin unlimited times, and use templates without signup. No payment is required to use the wheel on this page.",
  },
]
