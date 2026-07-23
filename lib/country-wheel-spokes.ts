import {

  COUNTRY_WHEEL_PAGE_TITLE,

  COUNTRY_WHEEL_PATH,

  COUNTRY_WHEEL_SITE_URL,

} from "@/lib/country-wheel-seo"

import {

  COUNTRY_WHEEL_USE_CASES,

  getCountryWheelUseCase,

  type CountryWheelUseCaseAccent,

  type CountryWheelUseCaseConfig,

  type CountryWheelUseCaseId,

} from "@/lib/country-wheel-use-cases"



export type CountryWheelSpokeId = CountryWheelUseCaseId



export type CountryWheelDeepLink = {

  useCaseId: CountryWheelUseCaseId

  config: CountryWheelUseCaseConfig

}



export type CountryWheelSpokeFaq = {

  question: string

  answer: string

}



export type CountryWheelSpokeSeo = {

  id: CountryWheelSpokeId

  path: string

  pageTitle: string

  description: string

  h1: string

  shortTitle: string

  heroIntro: string

  keywords: readonly string[]

  articleTitle: string

  articleIntro: readonly string[]

  uniqueSection: {

    title: string

    intro: string

    points: readonly { title: string; description: string }[]

  }

  faq: readonly CountryWheelSpokeFaq[]

  siblingIds: readonly CountryWheelSpokeId[]

  deepLink: CountryWheelDeepLink

  accent: CountryWheelUseCaseAccent

}



export function countrySpokeUrl(path: string): string {

  return `${COUNTRY_WHEEL_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`

}



function configFor(id: CountryWheelUseCaseId): CountryWheelUseCaseConfig {

  const useCase = getCountryWheelUseCase(id)

  if (!useCase) {

    return getCountryWheelUseCase("all")!.config

  }

  return useCase.config

}



type SpokeDraft = Omit<CountryWheelSpokeSeo, "siblingIds" | "deepLink" | "faq" | "accent"> & {

  faq?: readonly CountryWheelSpokeFaq[]

  accent?: CountryWheelUseCaseAccent

  faqLabel?: string

}



const ALL_IDS = COUNTRY_WHEEL_USE_CASES.map((u) => u.id) as CountryWheelSpokeId[]



function siblingsExcept(id: CountryWheelSpokeId): CountryWheelSpokeId[] {

  return ALL_IDS.filter((x) => x !== id).slice(0, 8)

}



function baseFaq(label: string): CountryWheelSpokeFaq[] {

  return [

    {

      question: `What is the ${label}?`,

      answer: `It is a Country Picker Wheel template preloaded for ${label.toLowerCase()} so every spin stays inside that pool with equal odds.`,

    },

    {

      question: "Can I switch back to all countries?",

      answer: `Yes. Open the hub at ${COUNTRY_WHEEL_PATH} or the All Countries template.`,

    },

    {

      question: "Are spins fair?",

      answer: "Yes. Each enabled country on the wheel has equal probability.",

    },

    {

      question: "What shows after I spin?",

      answer:

        "The result card shows the country name and flag plus capital, region, and language when available.",

    },

    {

      question: "Can I open Themes and Games on this page?",

      answer:

        "Yes. Themes, Games, Achievements, Analytics, and Social chips work the same as on the main Country Picker Wheel.",

    },

  ]

}



function finalize(draft: SpokeDraft): CountryWheelSpokeSeo {

  const useCase = getCountryWheelUseCase(draft.id)

  const { faqLabel, faq, accent, ...rest } = draft

  return {

    ...rest,

    accent: accent ?? useCase?.accent ?? "sky",

    faq: faq ?? baseFaq(faqLabel || draft.h1),

    siblingIds: siblingsExcept(draft.id),

    deepLink: { useCaseId: draft.id, config: configFor(draft.id) },

  }

}



function continentSpoke(

  id: Extract<

    CountryWheelSpokeId,

    "europe" | "asia" | "africa" | "north-america" | "south-america" | "oceania"

  >,

  path: string,

  regionLabel: string,

  accent: CountryWheelUseCaseAccent,

): CountryWheelSpokeSeo {

  return finalize({

    id,

    path,

    accent,

    pageTitle: `${regionLabel} Country Picker Wheel | Random ${regionLabel} Country Spinner`,

    description: `Spin a random ${regionLabel} country for quizzes, travel inspiration, and fair classroom picks.`,

    h1: `${regionLabel} Country Picker Wheel`,

    shortTitle: `${regionLabel} Picker Wheel`,

    heroIntro: `Load ${regionLabel} countries only and spin a fair pick for geography quizzes, streams, and trip ideas.`,

    keywords: [

      `${regionLabel.toLowerCase()} country picker wheel`,

      `random ${regionLabel.toLowerCase()} country`,

      "country picker",

      "geography wheel",

    ],

    articleTitle: `Using ${/^[aeiou]/i.test(regionLabel) ? "an" : "a"} ${regionLabel} Country Picker Wheel`,

    articleIntro: [

      `This template keeps countries outside ${regionLabel} off the wheel so every spin stays region-locked.`,

      "Use Elimination Mode for multi-round quizzes and open Results to recap winners.",

    ],

    uniqueSection: {

      title: `Built for ${regionLabel} challenges`,

      intro: `Continent templates keep other regions off the wheel when your quiz or trip is ${regionLabel}-focused.`,

      points: [

        {

          title: "Focused pool",

          description: `Only ${regionLabel} countries from the curated catalog.`,

        },

        {

          title: "Classroom ready",

          description: "Equal odds and Elimination Mode for fair multi-round games.",

        },

        {

          title: "Travel nights",

          description: "Spin destination ideas without diluting the continent theme.",

        },

      ],

    },

    faqLabel: `${regionLabel} Country Picker Wheel`,

  })

}



export const COUNTRY_WHEEL_SPOKES: Record<CountryWheelSpokeId, CountryWheelSpokeSeo> = {

  all: finalize({

    id: "all",

    path: COUNTRY_WHEEL_PATH,

    accent: "sky",

    pageTitle: COUNTRY_WHEEL_PAGE_TITLE,

    description:

      "Free random country generator. Spin a curated world country picker wheel for travel, quizzes, and fun.",

    h1: "Country Picker Wheel",

    shortTitle: "Country Picker Wheel",

    heroIntro:

      "Need any country at random? This page loads the curated world catalog so you can spin a fair pick for travel, classrooms, and games.",

    keywords: ["country picker wheel", "random country", "country picker"],

    articleTitle: "Random Country Picker Wheel hub",

    articleIntro: [

      "This is the full curated Country Picker Wheel catalog on one page—spin any listed country with equal odds.",

    ],

    uniqueSection: {

      title: "Built for world spins",

      intro: "Start here for all countries, then jump to continent or travel templates.",

      points: [

        { title: "Full catalog", description: "Every country in the dataset on one spinner." },

        { title: "Templates", description: "Continent and travel spokes one click away." },

        { title: "Fair odds", description: "Equal chance per enabled country." },

      ],

    },

  }),

  europe: continentSpoke("europe", "/europe-country-picker-wheel", "Europe", "blue"),

  asia: continentSpoke("asia", "/asia-country-picker-wheel", "Asia", "amber"),

  africa: continentSpoke("africa", "/africa-country-picker-wheel", "Africa", "emerald"),

  "north-america": continentSpoke(

    "north-america",

    "/north-america-country-picker-wheel",

    "North America",

    "rose",

  ),

  "south-america": continentSpoke(

    "south-america",

    "/south-america-country-picker-wheel",

    "South America",

    "orange",

  ),

  oceania: continentSpoke("oceania", "/oceania-country-picker-wheel", "Oceania", "teal"),

  travel: finalize({

    id: "travel",

    path: "/travel-destination-picker-wheel",

    accent: "violet",

    pageTitle: "Travel Destination Picker Wheel | Random Country Trip Spinner",

    description:

      "Spin a curated travel-destination country shortlist for trip inspiration and group decisions.",

    h1: "Travel Destination Picker Wheel",

    shortTitle: "Travel Picker Wheel",

    heroIntro:

      "Load a curated destination shortlist and spin a fair country for your next trip brainstorm.",

    keywords: ["travel destination picker wheel", "random travel country", "trip spinner"],

    articleTitle: "Travel destination country spins",

    articleIntro: [

      "Travel templates keep the pool to destination-friendly countries for trip nights and group votes.",

    ],

    uniqueSection: {

      title: "Built for trip nights",

      intro: "Curated shortlists beat scrolling a full world list when planning.",

      points: [

        { title: "Curated pool", description: "Popular travel-friendly countries." },

        { title: "Group fairness", description: "Equal odds end destination debates." },

        { title: "Quick facts", description: "Capital and language after each spin." },

      ],

    },

  }),

  visit: finalize({

    id: "visit",

    path: "/random-country-to-visit-picker-wheel",

    accent: "indigo",

    pageTitle: "Random Country to Visit Picker Wheel | Where Should I Travel Spinner",

    description: "Spin a random country to visit next—fair picks for travel inspiration.",

    h1: "Random Country to Visit Picker Wheel",

    shortTitle: "Visit Picker Wheel",

    heroIntro: "Cannot decide where to go? Spin a random country to visit from a travel-friendly shortlist.",

    keywords: ["random country to visit picker", "where to travel spinner", "visit country picker wheel"],

    articleTitle: "Random country to visit",

    articleIntro: [

      "This spoke focuses on visit-next energy—same fair spinner, travel-oriented pool.",

    ],

    uniqueSection: {

      title: "Built for visit-next picks",

      intro: "Use when the only question is which country to visit next.",

      points: [

        { title: "Visit focus", description: "Shortlist oriented to travel inspiration." },

        { title: "Elimination", description: "Remove winners across planning rounds." },

        { title: "Shareable", description: "Results history for group chats." },

      ],

    },

  }),

  favorites: finalize({

    id: "favorites",

    path: "/favorite-countries-picker-wheel",

    accent: "rose",

    pageTitle: "Favorite Countries Picker Wheel | Shortlist Country Spinner",

    description: "Spin a favorites-style country shortlist for polls and party drafts.",

    h1: "Favorite Countries Picker Wheel",

    shortTitle: "Favorites Picker Wheel",

    heroIntro: "Spin a favorites-style shortlist when you want a tighter country pool.",

    keywords: ["favorite countries picker wheel", "country shortlist spinner"],

    articleTitle: "Favorite countries spins",

    articleIntro: [

      "Favorites spoke loads a shortlist-style pool—star countries on the hub for personal favorites anytime.",

    ],

    uniqueSection: {

      title: "Built for shortlists",

      intro: "Tighter pools keep polls and party games moving.",

      points: [

        { title: "Shortlist energy", description: "Smaller set than the full world catalog." },

        { title: "Hub favorites", description: "Use the Heart tools on the main Country Picker Wheel too." },

        { title: "Fair polls", description: "Equal odds for transparent votes." },

      ],

    },

  }),

  g20: finalize({

    id: "g20",

    path: "/g20-country-picker-wheel",

    accent: "amber",

    pageTitle: "G20 Country Picker Wheel | Spin G20 Countries",

    description:

      "Spin a G20 countries picker wheel for economics lessons, trivia, and classroom challenges.",

    h1: "G20 Country Picker Wheel",

    shortTitle: "G20 Picker Wheel",

    heroIntro:

      "Load G20 member countries and spin a fair pick for economics units, trivia nights, and school projects.",

    keywords: ["g20 country picker wheel", "g20 countries spinner", "g20 random picker"],

    articleTitle: "G20 country spins",

    articleIntro: [

      "This template keeps the pool to G20 economies so every spin stays on-theme for economics and current-events lessons.",

    ],

    uniqueSection: {

      title: "Built for economics & trivia",

      intro: "A focused list beats scrolling the full world when teaching major economies.",

      points: [

        { title: "G20 focus", description: "Member countries only (EU bloc excluded)." },

        { title: "Classroom ready", description: "Equal odds for fair multi-round games." },

        { title: "Trivia nights", description: "Quick prompts for current-events quizzes." },

      ],

    },

  }),

  un: finalize({

    id: "un",

    path: "/un-country-picker-wheel",

    accent: "blue",

    pageTitle: "UN Country Picker Wheel | UN Member Countries Spinner",

    description:

      "Spin a UN member countries picker wheel for school geography, Model UN warm-ups, and world quizzes.",

    h1: "UN Country Picker Wheel",

    shortTitle: "UN Picker Wheel",

    heroIntro:

      "Load a UN member-focused world list and spin a fair country for schools and geography lessons.",

    keywords: ["un country picker wheel", "un member countries spinner", "united nations picker wheel"],

    articleTitle: "UN member country spins",

    articleIntro: [

      "Schools use this spoke for Model UN warm-ups and world-awareness activities with a broad member-style catalog.",

    ],

    uniqueSection: {

      title: "Built for schools",

      intro: "A broad world list keeps geography lessons moving.",

      points: [

        { title: "World list", description: "Curated catalog for UN-style classroom use." },

        { title: "Equal odds", description: "Fair spins for transparent quizzes." },

        { title: "Hub link", description: "Jump back to the Country Picker Wheel anytime." },

      ],

    },

  }),

  population: finalize({

    id: "population",

    path: "/countries-by-population-picker-wheel",

    accent: "violet",

    pageTitle: "Countries by Population Picker Wheel | Most Populous Country Spinner",

    description:

      "Spin the most populous countries for trivia, classroom challenges, and geography games.",

    h1: "Countries by Population Picker Wheel",

    shortTitle: "Population Picker Wheel",

    heroIntro:

      "Load the most populous countries and spin a fair pick for trivia fans and classroom challenges.",

    keywords: [

      "countries by population picker wheel",

      "most populous countries spinner",

      "population country picker",

    ],

    articleTitle: "Countries by population spins",

    articleIntro: [

      "This template ranks the catalog by population so trivia and classroom rounds stay focused on high-population countries.",

    ],

    uniqueSection: {

      title: "Built for trivia fans",

      intro: "Population leaders make memorable quiz prompts.",

      points: [

        { title: "Top populations", description: "Sorted shortlist from the curated catalog." },

        { title: "Trivia ready", description: "Great for family challenges and streams." },

        { title: "Fair odds", description: "Equal chance among enabled entries." },

      ],

    },

  }),

}



export function getCountryWheelSpoke(id: CountryWheelSpokeId): CountryWheelSpokeSeo {

  return COUNTRY_WHEEL_SPOKES[id]

}



export function getAllCountryWheelSpokes(): CountryWheelSpokeSeo[] {

  return ALL_IDS.map((id) => COUNTRY_WHEEL_SPOKES[id])

}



export function getCountrySpokeSiblings(

  spoke: CountryWheelSpokeSeo,

): CountryWheelSpokeSeo[] {

  return spoke.siblingIds.map((id) => COUNTRY_WHEEL_SPOKES[id])

}



export const COUNTRY_WHEEL_POPULAR_SPOKE_LINKS: {

  id: CountryWheelSpokeId

  href: string

  label: string

  description: string

  accent: CountryWheelUseCaseAccent

}[] = (

  [

    "all",

    "europe",

    "asia",

    "africa",

    "north-america",

    "south-america",

    "oceania",

    "g20",

    "un",

    "population",

    "travel",

    "visit",

  ] as CountryWheelSpokeId[]

).map((id) => {

  const s = COUNTRY_WHEEL_SPOKES[id]

  return {

    id,

    href: s.path,

    label: s.shortTitle,

    description: s.heroIntro.slice(0, 90),

    accent: s.accent,

  }

})

