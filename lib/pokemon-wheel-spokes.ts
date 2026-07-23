import { POKEMON_WHEEL_PATH, POKEMON_WHEEL_SITE_URL } from "@/lib/pokemon-wheel-seo"
import {
  POKEMON_WHEEL_USE_CASES,
  type PokemonWheelUseCaseConfig,
  type PokemonWheelUseCaseId,
} from "@/lib/pokemon-wheel-use-cases"

export type PokemonWheelSpokeId = PokemonWheelUseCaseId

export type PokemonWheelDeepLink = {
  useCaseId: PokemonWheelUseCaseId
  config: PokemonWheelUseCaseConfig
}

export type PokemonWheelSpokeFaq = {
  question: string
  answer: string
}

export type PokemonWheelSpokeSeo = {
  id: PokemonWheelSpokeId
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
  faq: readonly PokemonWheelSpokeFaq[]
  siblingIds: readonly PokemonWheelSpokeId[]
  deepLink: PokemonWheelDeepLink
}

export function pokemonSpokeUrl(path: string): string {
  return `${POKEMON_WHEEL_SITE_URL}${path}`
}

const ALL_IDS: PokemonWheelSpokeId[] = POKEMON_WHEEL_USE_CASES.map((u) => u.id)

function siblingsExcept(id: PokemonWheelSpokeId): PokemonWheelSpokeId[] {
  return ALL_IDS.filter((s) => s !== id)
}

function configFor(id: PokemonWheelUseCaseId): PokemonWheelUseCaseConfig {
  const found = POKEMON_WHEEL_USE_CASES.find((u) => u.id === id)
  if (!found) throw new Error(`Missing Pokémon use case: ${id}`)
  return found.config
}

function baseFaq(label: string): readonly PokemonWheelSpokeFaq[] {
  return [
    {
      question: `What is a ${label}?`,
      answer: `A ${label} is a ready-made Pokémon Picker Wheel template. It opens with a matching Pokémon set so you can spin a fair random pick right away.`,
    },
    {
      question: "Can I change the Pokémon after opening this page?",
      answer:
        "Yes. Add or remove entries in the Inputs panel. Your edits stay on this device in My Wheels if you keep the wheel.",
    },
    {
      question: "Is the pick random?",
      answer:
        "Yes. When each Pokémon appears once with equal weight, every entry on the wheel has an equal chance.",
    },
    {
      question: "Where is the main Pokémon Picker Wheel?",
      answer: `Open the Pokémon Picker Wheel pillar at ${POKEMON_WHEEL_PATH} for all templates, guides, and related tools.`,
    },
  ]
}

type SpokeDraft = Omit<PokemonWheelSpokeSeo, "siblingIds" | "deepLink" | "faq"> & {
  faqLabel?: string
}

function finalize(draft: SpokeDraft): PokemonWheelSpokeSeo {
  return {
    ...draft,
    faq: baseFaq(draft.faqLabel || draft.h1),
    siblingIds: siblingsExcept(draft.id),
    deepLink: { useCaseId: draft.id, config: configFor(draft.id) },
  }
}

const GEN_REGION: Record<string, { region: string; games: string }> = {
  gen1: { region: "Kanto", games: "nostalgia drafts and Gen 1–locked playthroughs" },
  gen2: { region: "Johto", games: "Gen 2 challenges, drafts, and streams" },
  gen3: { region: "Hoenn", games: "Gen 3 challenges, drafts, and classroom fun" },
  gen4: { region: "Sinnoh", games: "Gen 4 challenges, drafts, and party games" },
  gen5: { region: "Unova", games: "Gen 5 challenges, drafts, and streams" },
  gen6: { region: "Kalos", games: "Gen 6 challenges, drafts, and watch-alongs" },
  gen7: { region: "Alola", games: "Gen 7 challenges, drafts, and party games" },
  gen8: { region: "Galar", games: "Gen 8 challenges, drafts, and classroom fun" },
  gen9: { region: "Paldea", games: "current-gen challenges, drafts, and streams" },
}

function genSpoke(id: PokemonWheelSpokeId, n: number): PokemonWheelSpokeSeo {
  const meta = GEN_REGION[`gen${n}`]
  const path = `/generation-${n}-pokemon-picker-wheel`
  return finalize({
    id,
    path,
    pageTitle: `Generation ${n} Pokémon Picker Wheel | Random ${meta.region} Spinner`,
    description: `Spin a random Generation ${n} Pokémon. ${meta.region} roster on one fair Pokémon Picker Wheel for ${meta.games}.`,
    h1: `Generation ${n} Pokémon Picker Wheel`,
    shortTitle: `Generation ${n}`,
    heroIntro: `Load only Generation ${n} and spin a fair ${meta.region} pick for ${meta.games}.`,
    keywords: [
      `generation ${n} pokemon wheel`,
      `gen ${n} pokemon spinner`,
      `random gen ${n} pokemon`,
      `${meta.region.toLowerCase()} pokemon picker`,
    ],
    articleTitle: `Why Spin Generation ${n} Only?`,
    articleIntro: [
      `Gen ${n} templates keep other generations off the wheel when your challenge or draft is ${meta.region}-locked.`,
      "Same Pokémon Picker Wheel tools—just this generation’s curated set ready to spin.",
    ],
    uniqueSection: {
      title: `Built for ${meta.region} pools`,
      intro: `Use this template when only Generation ${n} Pokémon count.`,
      points: [
        {
          title: `${meta.region} drafts`,
          description: `Assign Gen ${n} picks without cross-generation noise.`,
        },
        {
          title: "Challenge runs",
          description: `Spin a theme for a Gen ${n} playthrough.`,
        },
        {
          title: "Fair spins",
          description: "Equal odds when each entry appears once.",
        },
      ],
    },
  })
}

function typeSpoke(
  id: PokemonWheelSpokeId,
  typeName: string,
  path: string,
): PokemonWheelSpokeSeo {
  return finalize({
    id,
    path,
    pageTitle: `${typeName} Type Pokémon Picker Wheel | Random ${typeName} Spinner`,
    description: `Spin a random ${typeName}-type Pokémon. ${typeName} types only on one fair Pokémon Picker Wheel for type challenges, drafts, and streams.`,
    h1: `${typeName} Type Pokémon Picker Wheel`,
    shortTitle: `${typeName} Type`,
    heroIntro: `Load ${typeName}-type Pokémon only and spin a fair pick for type-locked challenges, drafts, and party games.`,
    keywords: [
      `${typeName.toLowerCase()} type pokemon wheel`,
      `random ${typeName.toLowerCase()} pokemon`,
      `${typeName.toLowerCase()} pokemon spinner`,
    ],
    articleTitle: `Why Spin ${typeName} Types Only?`,
    articleIntro: [
      `${typeName}-type templates keep other types off the wheel when your challenge or draft is type-locked.`,
      `Same Pokémon Picker Wheel tools—just ${typeName}-type entries ready to spin.`,
    ],
    uniqueSection: {
      title: `Built for ${typeName} challenges`,
      intro: `Use this template when only ${typeName}-type Pokémon count.`,
      points: [
        {
          title: "Type challenge runs",
          description: `Spin a ${typeName} partner or theme without other types.`,
        },
        {
          title: "Draft themes",
          description: `Assign ${typeName} picks for themed party nights.`,
        },
        {
          title: "Streamer segments",
          description: `Let the wheel choose a ${typeName}-type live on camera.`,
        },
      ],
    },
  })
}

export const POKEMON_WHEEL_SPOKES: Record<PokemonWheelSpokeId, PokemonWheelSpokeSeo> = {
  all: finalize({
    id: "all",
    path: "/random-pokemon-generator-picker-wheel",
    pageTitle: "Random Pokémon Generator | Spin Any Pokémon Free",
    description:
      "Free random Pokémon generator. Spin a curated full-catalog Pokémon Picker Wheel for games, challenges, team ideas, and fun—no signup required.",
    h1: "Random Pokémon Generator",
    shortTitle: "All Pokémon",
    heroIntro:
      "Need any Pokémon at random? This page loads the curated catalog so you can spin a fair pick for challenges, teams, and streams.",
    keywords: [
      "random pokemon generator",
      "random pokemon",
      "pokemon generator",
      "pokemon spinner",
    ],
    articleTitle: "How to Pick a Random Pokémon",
    articleIntro: [
      "A random Pokémon generator is the fastest way to choose a creature without bias. Spin once for a challenge pick, or use elimination for multi-round drafts.",
      "This page is a focused Pokémon Picker Wheel template—same spinner, preloaded with the curated catalog.",
    ],
    uniqueSection: {
      title: "Best for full-catalog spins",
      intro: "Use the full curated set whenever any listed Pokémon is fair game.",
      points: [
        {
          title: "Challenge icebreakers",
          description: "Assign a random theme or gift pick before you start.",
        },
        {
          title: "Streamer challenges",
          description: "Let the wheel decide the creature for a segment.",
        },
        {
          title: "Party fairness",
          description: "Everyone sees the spin—no host favorites.",
        },
      ],
    },
  }),
  picker: finalize({
    id: "picker",
    path: "/pokemon-picker",
    pageTitle: "Pokémon Picker | Random Pokémon Picker Wheel Spinner Free",
    description:
      "Use this Pokémon picker to spin a random Pokémon for games, challenges, quizzes, or fun. Same fair Pokémon Picker Wheel with the curated catalog ready to spin.",
    h1: "Pokémon Picker",
    shortTitle: "Pokémon Picker",
    heroIntro:
      "Looking for a Pokémon picker? Spin the wheel to choose a Pokémon in seconds for teams, challenges, content, or friendly decisions.",
    keywords: [
      "pokemon picker",
      "pokemon picker wheel",
      "random pokemon picker",
      "pokemon selector",
    ],
    articleTitle: "What Is a Pokémon Picker?",
    articleIntro: [
      "A Pokémon picker is a random selector—here powered by an interactive wheel—so groups can watch a fair pick land live.",
      "Open filters and templates anytime, or return to the main Pokémon Picker Wheel hub for every generation and type page.",
    ],
    uniqueSection: {
      title: "Built for quick picks",
      intro: "Use this page when you want picker intent with a full curated pool.",
      points: [
        {
          title: "Decision spins",
          description: "Settle “which Pokémon?” debates in one spin.",
        },
        {
          title: "Team inspiration",
          description: "Spin seeds for team ideas without replacing strategy.",
        },
        {
          title: "Classroom & parties",
          description: "Everyone can see the Pokémon picker land live.",
        },
      ],
    },
  }),
  favorites: finalize({
    id: "favorites",
    path: "/favorite-pokemon-picker-wheel",
    pageTitle: "Favorite Pokémon Picker | Popular Pokémon Picker Wheel Free",
    description:
      "Spin a Favorite Pokémon Picker loaded with high-popularity Pokémon for community polls, streams, and classroom votes.",
    h1: "Favorite Pokémon Picker",
    shortTitle: "Favorite Pokémon Picker",
    heroIntro:
      "Run a favorite Pokémon picker with popular catalog picks—perfect for polls, streams, and “who’s your favorite?” games.",
    keywords: [
      "favorite pokemon picker",
      "favourite pokemon picker",
      "popular pokemon wheel",
      "pokemon poll spinner",
    ],
    articleTitle: "Spin Among Fan Favorites",
    articleIntro: [
      "This template focuses the Pokémon Picker Wheel on high-popularity entries so polls feel familiar and fun.",
      "Add or remove Pokémon anytime, heart your own favorites in the sidebar, and save the wheel for the next community vote.",
    ],
    uniqueSection: {
      title: "Built for community polls",
      intro: "Use this when the room wants recognizable favorites on the wheel.",
      points: [
        {
          title: "Stream polls",
          description: "Let chat watch a favorite Pokémon land live.",
        },
        {
          title: "Classroom votes",
          description: "Spin a fair pick from a popular shortlist.",
        },
        {
          title: "Party games",
          description: "Keep the energy high with well-known creatures.",
        },
      ],
    },
  }),
  types: finalize({
    id: "types",
    path: "/pokemon-type-picker-wheel",
    pageTitle: "Pokémon Type Picker Wheel | Random Type Practice Spinner",
    description:
      "Spin the Pokémon Type Wheel with one iconic Pokémon per type for battle practice, type quizzes, and themed challenges.",
    h1: "Pokémon Type Picker Wheel",
    shortTitle: "Pokémon Type Picker Wheel",
    heroIntro:
      "Practice types with a Pokémon Type Wheel—one iconic entry per type so every spin teaches a matchup cue.",
    keywords: [
      "pokemon type wheel",
      "pokemon types spinner",
      "type practice wheel",
      "random pokemon type",
    ],
    articleTitle: "Practice Pokémon Types by Picker Wheel",
    articleIntro: [
      "A Pokémon Type Wheel is ideal for type practice, gym-challenge themes, and classroom quizzes.",
      "Need a single type only? Open Fire, Water, Grass, and other type spokes from the Pokémon Picker Wheel hub.",
    ],
    uniqueSection: {
      title: "Built for type practice",
      intro: "Each slice highlights a different primary type from the curated catalog.",
      points: [
        {
          title: "Battle warm-ups",
          description: "Spin a type cue before a practice match.",
        },
        {
          title: "Quizzes",
          description: "Guess strengths and weaknesses from the winner.",
        },
        {
          title: "Themed challenges",
          description: "Lock a run or draft night to the spun type’s vibe.",
        },
      ],
    },
  }),
  gen1: genSpoke("gen1", 1),
  gen2: genSpoke("gen2", 2),
  gen3: genSpoke("gen3", 3),
  gen4: genSpoke("gen4", 4),
  gen5: genSpoke("gen5", 5),
  gen6: genSpoke("gen6", 6),
  gen7: genSpoke("gen7", 7),
  gen8: genSpoke("gen8", 8),
  gen9: genSpoke("gen9", 9),
  starters: finalize({
    id: "starters",
    path: "/starter-pokemon-picker-wheel",
    pageTitle: "Starter Pokémon Picker Wheel | Random Starter Spinner Free",
    description:
      "Spin a random starter Pokémon. Starter lines only on one fair Pokémon Picker Wheel for Nuzlocke drafts, first-partner picks, and fun.",
    h1: "Starter Pokémon Picker Wheel",
    shortTitle: "Starter Pokémon",
    heroIntro:
      "Load starter lines only and spin a fair first-partner pick for Nuzlocke drafts, challenge runs, and party games.",
    keywords: [
      "starter pokemon wheel",
      "random starter pokemon",
      "pokemon starter spinner",
      "starter pokemon picker",
    ],
    articleTitle: "Spin Among Starter Pokémon",
    articleIntro: [
      "The starters template filters the catalog to starter lines so every slice is a classic first-partner choice.",
      "Use it for Nuzlocke opening drafts, classroom icebreakers, and “pick your starter” streams.",
    ],
    uniqueSection: {
      title: "Built for starter drafts",
      intro: "Only starter Pokémon appear on this wheel.",
      points: [
        {
          title: "Nuzlocke openings",
          description: "Let the wheel choose a first partner fairly.",
        },
        {
          title: "Draft nights",
          description: "Assign starters across a multi-round elimination spin.",
        },
        {
          title: "Classroom picks",
          description: "A small curated set is easy to explain and spin.",
        },
      ],
    },
  }),
  legendaries: finalize({
    id: "legendaries",
    path: "/legendary-pokemon-picker-wheel",
    pageTitle: "Legendary Pokémon Picker Wheel | Random Legendary Spinner",
    description:
      "Spin a random legendary Pokémon. Legendary picks on one fair Pokémon Picker Wheel for challenge runs, trivia, and streamer themes.",
    h1: "Legendary Pokémon Picker Wheel",
    shortTitle: "Legendary Pokémon",
    heroIntro:
      "Load legendary Pokémon only and spin a fair pick for challenge themes, trivia nights, and streams.",
    keywords: [
      "legendary pokemon wheel",
      "random legendary pokemon",
      "legendary pokemon spinner",
    ],
    articleTitle: "Spin Among Legendary Pokémon",
    articleIntro: [
      "The legendaries template filters the catalog to legendary entries for high-profile challenge energy.",
      "Looking for mythicals instead? Open the Mythical Pokémon Picker Wheel from the hub cluster.",
    ],
    uniqueSection: {
      title: "Built for legendary themes",
      intro: "Only legendary Pokémon appear on this wheel.",
      points: [
        {
          title: "Trivia nights",
          description: "Spin a legendary, then quiz the room.",
        },
        {
          title: "Challenge themes",
          description: "Assign a legendary motif for a playthrough segment.",
        },
        {
          title: "Streamer bits",
          description: "Let viewers watch a legendary pick land live.",
        },
      ],
    },
  }),
  mythicals: finalize({
    id: "mythicals",
    path: "/mythical-pokemon-picker-wheel",
    pageTitle: "Mythical Pokémon Picker Wheel | Random Mythical Spinner",
    description:
      "Spin a random mythical Pokémon. Mythical picks on one fair Pokémon Picker Wheel for collectors, trivia, and challenge themes.",
    h1: "Mythical Pokémon Picker Wheel",
    shortTitle: "Mythical Pokémon",
    heroIntro:
      "Load mythical Pokémon only and spin a fair collector-style pick for trivia, challenges, and streams.",
    keywords: [
      "mythical pokemon wheel",
      "random mythical pokemon",
      "mythical pokemon spinner",
    ],
    articleTitle: "Spin Among Mythical Pokémon",
    articleIntro: [
      "The mythicals template focuses rare event-style creatures from the curated catalog.",
      "Pair it with the Legendary Pokémon Picker Wheel when your challenge distinguishes both groups.",
    ],
    uniqueSection: {
      title: "Built for collectors & themes",
      intro: "Only mythical Pokémon appear on this wheel.",
      points: [
        {
          title: "Collector nights",
          description: "Spin a mythical for trivia or showcase segments.",
        },
        {
          title: "Challenge motifs",
          description: "Assign a mythical theme without legendary overlap.",
        },
        {
          title: "Content hooks",
          description: "Rare names make great stream and video titles.",
        },
      ],
    },
  }),
  shiny: finalize({
    id: "shiny",
    path: "/shiny-pokemon-picker-wheel",
    pageTitle: "Shiny Pokémon Picker Wheel | Shiny Hunt Challenge Spinner",
    description:
      "Spin a Shiny Pokémon Picker Wheel loaded with popular shiny-hunt targets for fun challenges, streams, and party games.",
    h1: "Shiny Pokémon Picker Wheel",
    shortTitle: "Shiny Pokémon Picker Wheel",
    heroIntro:
      "Spin popular shiny-hunt targets from the curated catalog—great for challenge runs, streams, and “who do we hunt next?” decisions.",
    keywords: [
      "shiny pokemon wheel",
      "shiny hunt spinner",
      "random shiny pokemon challenge",
    ],
    articleTitle: "Spin a Shiny Hunt Challenge",
    articleIntro: [
      "This template uses high-popularity Pokémon as shiny-hunt challenge targets—not live shiny odds from any game.",
      "Customize the list, remove anything you already hunted, and save the wheel for the next stream.",
    ],
    uniqueSection: {
      title: "Built for hunt challenges",
      intro: "Use this when the group needs a fair “what do we hunt?” spin.",
      points: [
        {
          title: "Stream hunts",
          description: "Let chat watch the next target land live.",
        },
        {
          title: "Party challenges",
          description: "Assign each player a hunt target fairly.",
        },
        {
          title: "Content series",
          description: "Spin a recurring shiny-challenge roster.",
        },
      ],
    },
  }),
  eeveelutions: finalize({
    id: "eeveelutions",
    path: "/eeveelution-picker-wheel",
    pageTitle: "Eeveelution Picker Wheel | Random Eevee Evolution Spinner",
    description:
      "Spin the Eeveelution Wheel—Eevee and every Eeveelution on one fair Pokémon Picker Wheel for fans, drafts, and party picks.",
    h1: "Eeveelution Picker Wheel",
    shortTitle: "Eeveelution Picker Wheel",
    heroIntro:
      "Can't choose an Eeveelution? Spin Eevee and every evolution on one fair wheel for fans, drafts, and fun.",
    keywords: [
      "eeveelution wheel",
      "eevee evolution spinner",
      "random eeveelution",
      "eevee wheel",
    ],
    articleTitle: "Spin Among Eeveelutions",
    articleIntro: [
      "The Eeveelution Wheel keeps only Eevee and its evolutions on the spinner.",
      "Perfect for fan polls, starter-adjacent drafts, and “which Eeveelution?” content.",
    ],
    uniqueSection: {
      title: "Built for Eevee fans",
      intro: "Only Eevee and Eeveelutions appear on this wheel.",
      points: [
        {
          title: "Fan polls",
          description: "Settle favorite Eeveelution debates fairly.",
        },
        {
          title: "Draft fun",
          description: "Assign Eeveelutions across a party night.",
        },
        {
          title: "Content hooks",
          description: "A compact, iconic set spins cleanly on stream.",
        },
      ],
    },
  }),
  fire: typeSpoke("fire", "Fire", "/pokemon-fire-type-picker-wheel"),
  water: typeSpoke("water", "Water", "/pokemon-water-type-picker-wheel"),
  grass: typeSpoke("grass", "Grass", "/pokemon-grass-type-picker-wheel"),
  electric: typeSpoke("electric", "Electric", "/pokemon-electric-type-picker-wheel"),
  psychic: typeSpoke("psychic", "Psychic", "/pokemon-psychic-type-picker-wheel"),
  dragon: typeSpoke("dragon", "Dragon", "/pokemon-dragon-type-picker-wheel"),
}

export function getPokemonWheelSpoke(id: PokemonWheelSpokeId): PokemonWheelSpokeSeo {
  return POKEMON_WHEEL_SPOKES[id]
}

export function getPokemonSpokeSiblings(
  spoke: PokemonWheelSpokeSeo,
): PokemonWheelSpokeSeo[] {
  return spoke.siblingIds.map((id) => POKEMON_WHEEL_SPOKES[id])
}

export const POKEMON_WHEEL_POPULAR_SPOKE_LINKS = ALL_IDS.map((id) => {
  const spoke = POKEMON_WHEEL_SPOKES[id]
  const useCase = POKEMON_WHEEL_USE_CASES.find((u) => u.id === id)!
  return {
    id,
    label: useCase.label,
    href: spoke.path,
    description: useCase.description,
    accent: useCase.accent,
  }
})
