import { HOME_SITE_URL } from "@/lib/home-seo"

export const COUNTRY_WHEEL_SITE_URL = HOME_SITE_URL
export const COUNTRY_WHEEL_PATH = "/spin-random-country-wheel"
/** Legacy hub URL — kept as a permanent redirect target source */
export const COUNTRY_WHEEL_LEGACY_PATH = "/country-picker-wheel"
export const COUNTRY_WHEEL_URL = `${COUNTRY_WHEEL_SITE_URL}${COUNTRY_WHEEL_PATH}`
export const COUNTRY_WHEEL_OG_IMAGE_URL = `${COUNTRY_WHEEL_SITE_URL}/og/country-picker-wheel.svg`

export const COUNTRY_WHEEL_PAGE_TITLE =
  "Spin Random Country Wheel | Free Country Picker Online"

export const COUNTRY_WHEEL_PAGE_DESCRIPTION =
  "Spin a random country wheel to pick a nation from around the world. Compare country statistics, filter by continent, and use ready-made lists for geography games, travel ideas, and classroom quizzes."

export const COUNTRY_WHEEL_H1 = "Spin Random Country Wheel"

export const COUNTRY_WHEEL_SHORT_TITLE = "Spin Random Country Wheel"

export const COUNTRY_WHEEL_HERO_INTRO =
  "Looking for a fun way to choose a random country? Spin Random Country Wheel lets you spin a customizable picker and instantly select a country from around the world. Whether you're planning a trip, studying geography, creating classroom activities, or playing quiz games with friends, this free tool makes every selection fair, quick, and engaging—with country statistics and side-by-side compare built in."

export const COUNTRY_WHEEL_KEYWORDS = [
  "spin random country wheel",
  "random country wheel",
  "country picker wheel",
  "country wheel",
  "country wheel picker",
  "random country picker",
  "random country generator",
  "country spinner",
  "pick a random country",
  "choose a country",
  "spin country wheel",
  "country randomizer",
  "geography wheel",
  "travel destination picker",
  "world country picker",
  "country selection wheel",
  "country statistics compare",
  "learn world countries",
  "country challenge wheel",
] as const

/** Brief-aligned TOC — Spin / Customize / Popular / Uses / Why / vs Generator / FAQ */
export const COUNTRY_WHEEL_ON_THIS_PAGE = [
  { id: "country-spin-wheel", label: "Spin the random country wheel" },
  { id: "country-stats-compare", label: "Country statistics & compare" },
  { id: "country-customize", label: "Customize your country wheel" },
  { id: "country-popular", label: "Popular country picker wheels" },
  { id: "country-use-cases", label: "Common ways to use a country wheel" },
  { id: "country-why", label: "Why use a country picker wheel" },
  { id: "country-comparison", label: "Country picker vs random country generator" },
  { id: "country-options", label: "How this tool's options work" },
  { id: "country-related", label: "Related tools" },
  { id: "country-cluster", label: "Country topic cluster" },
  { id: "country-faq", label: "FAQ" },
] as const

export type CountryWheelLinkItem = {
  label: string
  href: string
  description: string
}

export const COUNTRY_WHEEL_POPULAR_TEMPLATES: CountryWheelLinkItem[] = [
  {
    label: "All Countries",
    href: COUNTRY_WHEEL_PATH,
    description: "Full world catalog on one fair spinner.",
  },
  {
    label: "Europe Countries",
    href: "/europe-country-picker-wheel",
    description: "European countries for quizzes and trips.",
  },
  {
    label: "Asia Countries",
    href: "/asia-country-picker-wheel",
    description: "Asian countries for classroom and travel picks.",
  },
  {
    label: "Africa Countries",
    href: "/africa-country-picker-wheel",
    description: "African countries for geography challenges.",
  },
  {
    label: "North America",
    href: "/north-america-country-picker-wheel",
    description: "North American countries only.",
  },
  {
    label: "South America",
    href: "/south-america-country-picker-wheel",
    description: "South American countries only.",
  },
  {
    label: "Oceania Countries",
    href: "/oceania-country-picker-wheel",
    description: "Oceania countries and islands.",
  },
  {
    label: "G20 Countries",
    href: "/g20-country-picker-wheel",
    description: "Major economies for classrooms and trivia.",
  },
  {
    label: "UN Member Countries",
    href: "/un-country-picker-wheel",
    description: "UN member-focused world list for schools.",
  },
  {
    label: "Countries by Population",
    href: "/countries-by-population-picker-wheel",
    description: "Most populous countries for trivia fans.",
  },
]

export const COUNTRY_WHEEL_CREATE_POINTS = [
  "Include all countries from the curated world catalog.",
  "Add your own country names via the Text tab.",
  "Remove countries you want to skip before spinning.",
  "Filter by continent with one-click region templates.",
  "Save favorites and reuse custom wheels in My Wheels.",
  "Share results and customize colors in Style / Themes.",
] as const

export const COUNTRY_WHEEL_WHATS_ON_WHEEL = [
  "Country name and flag emoji for every entry in the catalog.",
  "Continent / region filters powered by the same dataset.",
  "Capitals, languages, and population shown after a spin.",
  "Statistics and compare views for deeper country details.",
  "Ready-made lists: continents, G20, UN members, and population leaders.",
] as const

export const COUNTRY_WHEEL_FEATURES_REAL = [
  "Fair equal-odds spins with mute, fullscreen, and sound controls.",
  "Country statistics modal and side-by-side country comparison.",
  "Achievements, themes, analytics, social sharing, and game modes.",
  "Manual and AI-assisted suggestion tabs for inspiration.",
  "Results history to recap multi-round quizzes or draft nights.",
] as const

export const COUNTRY_WHEEL_STATS_INTRO =
  "Beyond the spin result card, this tool includes Country Statistics and Country Comparison so learners can inspect and compare curated reference facts. Values are for education and entertainment—not live census, GDP releases, visa rules, or official government data."

export const COUNTRY_WHEEL_STATS_DETAILS = [
  {
    title: "Country Statistics (single country)",
    description:
      "Open a country’s details to review Basic Information (capital, country code, subregion, continent), Demographics (population, area, density), Economy (currency, GDP, GDP per capita), and Culture & Language (languages, timezone), plus the flag.",
  },
  {
    title: "Country Comparison (side by side)",
    description:
      "Add countries from the list to compare them in one table: capital, population, area, population density, currency, language(s), GDP, GDP per capita, region, and timezone. Clear the list anytime and rebuild a new shortlist.",
  },
  {
    title: "How to use it",
    description:
      "From the Inputs country list, open Statistics for one country or add entries to Compare. Spin first for a random pick, then open stats/compare to turn the result into a quick geography discussion.",
  },
] as const

export const COUNTRY_WHEEL_STATS_FIELDS = [
  "Capital",
  "Country code / region / continent / subregion",
  "Population, area, and density",
  "Currency, GDP, and GDP per capita",
  "Language(s) and timezone",
  "Flag",
] as const

export const COUNTRY_WHEEL_HOW_IT_WORKS = [
  "Load all countries or open a ready-made continent / theme template.",
  "Optional: remove countries, add custom names, or filter by region.",
  "Click the wheel or Spin; duration and speed follow Settings.",
  "Read the winner card—capital, region, and language—then spin again.",
] as const

export const COUNTRY_WHEEL_CUSTOMIZE_STEPS = [
  "Include all countries or start from a continent / G20 / population template.",
  "Add or remove countries in Inputs or bulk-edit in the Text tab.",
  "Style tab: display mode (flag/name/both) and color themes.",
  "Other Options: confetti, sound, spinning duration and speed (synced with Settings).",
  "Save favorites, compare countries, and reuse wheels from My Wheels.",
] as const

export const COUNTRY_WHEEL_COMPARISON = [
  {
    title: "Country Picker Wheel",
    points: [
      "Interactive spinning with a visual experience",
      "Fun for classrooms, games, and live streams",
      "Easy to customize lists, themes, and filters",
      "Continent and theme templates one click away",
    ],
  },
  {
    title: "Random Country Generator",
    points: [
      "Instant random result with less ceremony",
      "Faster for quick one-off selections",
      "Often simple text output",
      "Usually fixed options with less classroom polish",
    ],
  },
] as const

export const COUNTRY_WHEEL_EEAT_TIPS = [
  "Every country appears once by default—equal chance unless you customize the list.",
  "Teachers: use Elimination for multi-round geography quizzes and map discussions.",
  "Travelers: spin for vacation inspiration or a virtual-tour country without overthinking.",
  "Creators: great for YouTube geography challenges, TikTok travel clips, and live streams.",
  "Facts (capital, population) are reference trivia—not live census, visa, or travel advice.",
] as const

export const COUNTRY_WHEEL_USE_CASES_COPY = [
  {
    title: "Geography Education",
    description:
      "Classroom quizzes, country identification, geography practice, and student research activities.",
  },
  {
    title: "Travel Planning",
    description:
      "Pick your next destination, vacation inspiration, backpacking challenges, and weekend travel ideas.",
  },
  {
    title: "Games",
    description:
      "Country guessing games, trivia nights, family challenges, and party games with fair spins.",
  },
  {
    title: "Content Creation",
    description:
      "YouTube geography challenges, TikTok travel videos, educational content, and live streams.",
  },
] as const

export const COUNTRY_WHEEL_WHY_POINTS = [
  "Fair random selection—equal odds per enabled country.",
  "Great for learning geography in classrooms and at home.",
  "Perfect for travel inspiration when the group cannot decide.",
  "Easy to customize: add, remove, filter, and theme the wheel.",
  "Mobile friendly for phones, tablets, and projectors.",
  "Free to use—no account required to spin.",
] as const

export const COUNTRY_WHEEL_RELATED_TOOLS: CountryWheelLinkItem[] = [
  {
    label: "Random Wheel Picker",
    href: "/",
    description: "The main picker wheel for any custom list.",
  },
  {
    label: "Random Number Picker",
    href: "/number-picker-wheel",
    description: "Pick random numbers for scoring or team sizes.",
  },
  {
    label: "Letter Picker",
    href: "/random-letter-picker",
    description: "Alphabet spins for naming games.",
  },
  {
    label: "Color Picker Wheel",
    href: "/color-picker-wheel",
    description: "Spin a random color for design and art prompts.",
  },
  {
    label: "Team Picker Wheel",
    href: "/team-picker-wheel",
    description: "Split people into fair random teams.",
  },
  {
    label: "State Wheel",
    href: "/spin-random-state-wheel",
    description: "Drill into US states after landing on the United States.",
  },
]

export const COUNTRY_WHEEL_CLUSTER_LINKS: CountryWheelLinkItem[] = [
  ...COUNTRY_WHEEL_POPULAR_TEMPLATES.slice(1),
  {
    label: "Random Country Picker",
    href: "/random-country-picker",
    description: "Alias-style entry for random country picker searches.",
  },
  {
    label: "Random Country Generator",
    href: "/random-country-generator",
    description: "Alias-style entry for random country generator searches.",
  },
]

export const COUNTRY_WHEEL_ARTICLE_TITLE = "Spin the Random Country Wheel"

export const COUNTRY_WHEEL_ARTICLE_INTRO = [
  "The Country Picker Wheel turns a long world list into a visual, equal-odds spinner. Load every country—or a continent and theme template—then spin to randomly select a country for geography games, classroom activities, travel inspiration, quizzes, and educational challenges.",
  "This page is an independent educational tool. Country facts are curated reference data for entertainment—not official government statistics, visa guidance, or a country-code / phone-code lookup.",
] as const

export const COUNTRY_WHEEL_OPTIONS_GUIDE = [
  {
    title: "Include all countries",
    description:
      "Start from the full world catalog on the Country Picker Wheel hub for a complete pool.",
  },
  {
    title: "Filter by continent",
    description:
      "Choose Europe / Asia / Africa / North America / South America / Oceania—or open a continent spoke page.",
  },
  {
    title: "Add or remove countries",
    description:
      "Toggle entries in Inputs, or bulk-edit names in the Text tab. Remove duplicates for fairness.",
  },
  {
    title: "Display & colors",
    description: "Style tab sets flag/name/both display and color themes for the wheel.",
  },
  {
    title: "Save, compare & statistics",
    description:
      "Star favorites, open Country Statistics for one nation, compare shortlists side by side, save wheels in My Wheels, and open Results to recap spins.",
  },
  {
    title: "Action Mode & Games",
    description:
      "Normal keeps every country after a spin. Elimination removes the winner. Header Games opens challenge modes.",
  },
  {
    title: "Sound, confetti & speed",
    description:
      "Other Options and Header Settings share spinning duration, speed, sound, and confetti.",
  },
  {
    title: "Theme templates",
    description: "G20, UN members, and countries-by-population spokes for focused classroom lists.",
  },
] as const

export const COUNTRY_WHEEL_FAQ_ITEMS = [
  {
    question: "What is a Country Picker Wheel?",
    answer:
      "A Country Picker Wheel is a free online spinner that randomly chooses a country from a curated world list—or from a continent or theme shortlist you load.",
  },
  {
    question: "Can I include every country in the world?",
    answer:
      "Yes. The hub loads the full curated catalog. You can also open continent or theme templates if you want a smaller pool.",
  },
  {
    question: "Can I spin only countries from one continent?",
    answer:
      "Yes. Use a continent region filter or open templates like /europe-country-picker-wheel and /asia-country-picker-wheel.",
  },
  {
    question: "Is every country equally likely to be selected?",
    answer:
      "Yes. Each enabled country on the wheel has equal odds. Deselect countries or use Elimination to change the pool after each spin.",
  },
  {
    question: "Can I remove countries before spinning?",
    answer:
      "Yes. Deselect countries in Inputs or edit the list in the Text tab so removed names never appear on the wheel.",
  },
  {
    question: "Can I save my custom country wheel?",
    answer:
      "Yes. Use My Wheels / favorites to keep shortlists you reuse for quizzes, trips, and streams.",
  },
  {
    question: "Can I use this for geography lessons?",
    answer:
      "Yes. Teachers use it for country identification, capitals practice, map activities, and multi-round classroom quizzes.",
  },
  {
    question: "Can I use it to choose travel destinations?",
    answer:
      "Yes. Spin the full list or travel-oriented templates when you need a fair destination pick without overthinking.",
  },
  {
    question: "Does it work on mobile devices?",
    answer:
      "Yes. The Country Picker Wheel is mobile friendly for phones, tablets, and classroom projectors.",
  },
  {
    question: "Is the Country Picker Wheel free?",
    answer:
      "Yes. You can spin and customize without paying. No account is required to use the basic wheel.",
  },
  {
    question: "What facts show after a spin?",
    answer:
      "The result card highlights the country name and flag, plus capital, region/continent, and language when available. Open Country Statistics for fuller details, or add countries to Compare for a side-by-side table.",
  },
  {
    question: "What can I see in Country Statistics and Compare?",
    answer:
      "Statistics covers capital, country code, subregion, continent, population, area, density, currency, GDP, GDP per capita, languages, timezone, and flag. Compare shows capital, population, area, density, currency, languages, GDP, GDP per capita, region, and timezone side by side.",
  },
  {
    question: "Is this a country music, phone-code, or flags API tool?",
    answer:
      "No. This page is only for spinning countries for education, travel inspiration, and games—not country music, dialing codes, or a developer flags API.",
  },
] as const
