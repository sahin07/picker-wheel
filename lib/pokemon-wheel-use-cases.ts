import { pokemonData } from "@/data/pokemon-data"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import type { DisplayMode, GenerationFilter, Pokemon } from "@/types/pokemon-types"

export type PokemonWheelUseCaseId =
  | "all"
  | "picker"
  | "favorites"
  | "types"
  | "gen1"
  | "gen2"
  | "gen3"
  | "gen4"
  | "gen5"
  | "gen6"
  | "gen7"
  | "gen8"
  | "gen9"
  | "starters"
  | "legendaries"
  | "mythicals"
  | "shiny"
  | "eeveelutions"
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "dragon"

export type PokemonWheelUseCaseAccent =
  | "sky"
  | "red"
  | "blue"
  | "amber"
  | "orange"
  | "teal"
  | "rose"
  | "lime"
  | "violet"
  | "emerald"
  | "yellow"
  | "indigo"
  | "pink"
  | "slate"

export type PokemonWheelUseCaseConfig = {
  selectedGeneration: GenerationFilter
  pokemon: Pokemon[]
  displayMode: DisplayMode
  templateParam: string
  typeFilter?: string | null
  curatedOnly?:
    | "starters"
    | "legendaries"
    | "mythicals"
    | "shiny"
    | "eeveelutions"
    | "favorites"
    | "types"
    | null
}

export type PokemonWheelUseCase = {
  id: PokemonWheelUseCaseId
  label: string
  description: string
  accent: PokemonWheelUseCaseAccent
  config: PokemonWheelUseCaseConfig
}

export function getAllPokemonFlat(): Pokemon[] {
  return Object.values(pokemonData).flat() as Pokemon[]
}

function byGeneration(gen: GenerationFilter): Pokemon[] {
  if (gen === "all") return getAllPokemonFlat()
  return (pokemonData[gen as keyof typeof pokemonData] || []) as Pokemon[]
}

function byType(typeName: string): Pokemon[] {
  return getAllPokemonFlat().filter((p) =>
    p.type.some((t) => t.toLowerCase() === typeName.toLowerCase()),
  )
}

function starters(): Pokemon[] {
  return getAllPokemonFlat().filter((p) => p.isStarter)
}

function legendaries(): Pokemon[] {
  return getAllPokemonFlat().filter((p) => p.isLegendary && !p.isMythical)
}

function mythicals(): Pokemon[] {
  return getAllPokemonFlat().filter((p) => p.isMythical)
}

function eeveelutions(): Pokemon[] {
  return getAllPokemonFlat().filter((p) => p.isEeveelution)
}

/** Popular hunt / stream targets for a fun “shiny challenge” wheel (curated catalog). */
function shinyHuntTargets(): Pokemon[] {
  return getAllPokemonFlat().filter((p) => p.popularity === "high")
}

function favoritePollTargets(): Pokemon[] {
  return getAllPokemonFlat().filter((p) => p.popularity === "high")
}

/** One iconic entry per primary type for battle-practice type spins. */
function typePracticePool(): Pokemon[] {
  const seen = new Set<string>()
  const out: Pokemon[] = []
  for (const p of getAllPokemonFlat()) {
    const primary = p.type[0]?.toLowerCase()
    if (!primary || seen.has(primary)) continue
    seen.add(primary)
    out.push(p)
  }
  return out
}

const GEN_META: Record<
  Exclude<
    PokemonWheelUseCaseId,
    | "all"
    | "picker"
    | "favorites"
    | "types"
    | "starters"
    | "legendaries"
    | "mythicals"
    | "shiny"
    | "eeveelutions"
    | "fire"
    | "water"
    | "grass"
    | "electric"
    | "psychic"
    | "dragon"
  >,
  { label: string; description: string; accent: PokemonWheelUseCaseAccent }
> = {
  gen1: { label: "Generation 1", description: "Kanto classics — Gen 1 Pokémon only.", accent: "red" },
  gen2: { label: "Generation 2", description: "Johto set for Gen 2 challenges.", accent: "amber" },
  gen3: { label: "Generation 3", description: "Hoenn Pokémon on one spinner.", accent: "teal" },
  gen4: { label: "Generation 4", description: "Sinnoh roster for Gen 4 spins.", accent: "violet" },
  gen5: { label: "Generation 5", description: "Unova Pokémon wheel.", accent: "indigo" },
  gen6: { label: "Generation 6", description: "Kalos Pokémon spinner.", accent: "rose" },
  gen7: { label: "Generation 7", description: "Alola Pokémon wheel.", accent: "orange" },
  gen8: { label: "Generation 8", description: "Galar Pokémon spinner.", accent: "lime" },
  gen9: { label: "Generation 9", description: "Paldea set for current-gen spins.", accent: "pink" },
}

function genCase(
  id: keyof typeof GEN_META,
): PokemonWheelUseCase {
  const meta = GEN_META[id]
  const gen = id as GenerationFilter
  return {
    id,
    label: meta.label,
    description: meta.description,
    accent: meta.accent,
    config: {
      selectedGeneration: gen,
      pokemon: byGeneration(gen),
      displayMode: "emoji-name",
      templateParam: id,
      typeFilter: null,
      curatedOnly: null,
    },
  }
}

function typeCase(
  id: "fire" | "water" | "grass" | "electric" | "psychic" | "dragon",
  typeName: string,
  label: string,
  description: string,
  accent: PokemonWheelUseCaseAccent,
): PokemonWheelUseCase {
  return {
    id,
    label,
    description,
    accent,
    config: {
      selectedGeneration: "all",
      pokemon: byType(typeName),
      displayMode: "emoji-name",
      templateParam: id,
      typeFilter: typeName,
      curatedOnly: null,
    },
  }
}

export const POKEMON_WHEEL_USE_CASES: PokemonWheelUseCase[] = [
  {
    id: "all",
    label: "All Pokémon",
    description: "Full curated catalog on one fair spinner.",
    accent: "sky",
    config: {
      selectedGeneration: "all",
      pokemon: getAllPokemonFlat(),
      displayMode: "emoji-name",
      templateParam: "all",
      typeFilter: null,
      curatedOnly: null,
    },
  },
  {
    id: "picker",
    label: "Pokémon Picker",
    description: "Pick a random Pokémon with the same fair spinner.",
    accent: "sky",
    config: {
      selectedGeneration: "all",
      pokemon: getAllPokemonFlat(),
      displayMode: "emoji-name",
      templateParam: "picker",
      typeFilter: null,
      curatedOnly: null,
    },
  },
  {
    id: "favorites",
    label: "Favorite Pokémon Picker",
    description: "High-popularity picks for community polls and streams.",
    accent: "rose",
    config: {
      selectedGeneration: "all",
      pokemon: favoritePollTargets(),
      displayMode: "emoji-name",
      templateParam: "favorites",
      typeFilter: null,
      curatedOnly: "favorites",
    },
  },
  {
    id: "types",
    label: "Pokémon Type Wheel",
    description: "One iconic Pokémon per type for battle practice.",
    accent: "teal",
    config: {
      selectedGeneration: "all",
      pokemon: typePracticePool(),
      displayMode: "emoji-name",
      templateParam: "types",
      typeFilter: null,
      curatedOnly: "types",
    },
  },
  genCase("gen1"),
  genCase("gen2"),
  genCase("gen3"),
  genCase("gen4"),
  genCase("gen5"),
  genCase("gen6"),
  genCase("gen7"),
  genCase("gen8"),
  genCase("gen9"),
  {
    id: "starters",
    label: "Starter Pokémon",
    description: "Starter lines only — great for Nuzlocke and drafts.",
    accent: "emerald",
    config: {
      selectedGeneration: "all",
      pokemon: starters(),
      displayMode: "emoji-name",
      templateParam: "starters",
      typeFilter: null,
      curatedOnly: "starters",
    },
  },
  {
    id: "legendaries",
    label: "Legendary Pokémon",
    description: "Legendary picks for challenge runs and trivia.",
    accent: "yellow",
    config: {
      selectedGeneration: "all",
      pokemon: legendaries(),
      displayMode: "emoji-name",
      templateParam: "legendaries",
      typeFilter: null,
      curatedOnly: "legendaries",
    },
  },
  {
    id: "mythicals",
    label: "Mythical Pokémon",
    description: "Mythical picks for collectors and challenge themes.",
    accent: "violet",
    config: {
      selectedGeneration: "all",
      pokemon: mythicals(),
      displayMode: "emoji-name",
      templateParam: "mythicals",
      typeFilter: null,
      curatedOnly: "mythicals",
    },
  },
  {
    id: "shiny",
    label: "Shiny Pokémon Wheel",
    description: "Popular shiny-hunt targets for fun challenge spins.",
    accent: "amber",
    config: {
      selectedGeneration: "all",
      pokemon: shinyHuntTargets(),
      displayMode: "emoji-name",
      templateParam: "shiny",
      typeFilter: null,
      curatedOnly: "shiny",
    },
  },
  {
    id: "eeveelutions",
    label: "Eeveelution Wheel",
    description: "Eevee and every Eeveelution on one spinner.",
    accent: "pink",
    config: {
      selectedGeneration: "all",
      pokemon: eeveelutions(),
      displayMode: "emoji-name",
      templateParam: "eeveelutions",
      typeFilter: null,
      curatedOnly: "eeveelutions",
    },
  },
  typeCase("fire", "Fire", "Fire Type", "Fire-type Pokémon only.", "orange"),
  typeCase("water", "Water", "Water Type", "Water-type Pokémon only.", "blue"),
  typeCase("grass", "Grass", "Grass Type", "Grass-type Pokémon only.", "lime"),
  typeCase("electric", "Electric", "Electric Type", "Electric-type Pokémon only.", "yellow"),
  typeCase("psychic", "Psychic", "Psychic Type", "Psychic-type Pokémon only.", "violet"),
  typeCase("dragon", "Dragon", "Dragon Type", "Dragon-type Pokémon only.", "indigo"),
]

export function getPokemonWheelUseCase(
  id: PokemonWheelUseCaseId,
): PokemonWheelUseCase | undefined {
  return POKEMON_WHEEL_USE_CASES.find((u) => u.id === id)
}

export function pokemonWheelUseCaseFromTemplate(
  template: string | null,
  generation: string | null,
): PokemonWheelUseCaseId | null {
  const t = (template || "").toLowerCase()
  const valid = POKEMON_WHEEL_USE_CASES.map((u) => u.id)
  if (t && (valid as string[]).includes(t)) return t as PokemonWheelUseCaseId
  if (t === "all-pokemon" || t === "random" || t === "generator") return "all"
  if (t === "pokemon-picker") return "picker"
  if (t === "favorite" || t === "favourite") return "favorites"
  if (t === "type" || t === "type-wheel") return "types"
  if (t === "starter") return "starters"
  if (t === "legendary") return "legendaries"
  if (t === "mythical") return "mythicals"
  if (t === "eevee" || t === "eeveelution") return "eeveelutions"
  const g = (generation || "").toLowerCase()
  if (g && (valid as string[]).includes(g)) return g as PokemonWheelUseCaseId
  return null
}

/** Apply a popular Pokémon template to the live wheel store. */
export function applyPokemonWheelUseCase(id: PokemonWheelUseCaseId): boolean {
  const useCase = getPokemonWheelUseCase(id)
  if (!useCase) return false

  const { config } = useCase
  const store = useWheelManagerStore.getState()

  if (store.currentTool !== "pokemon-wheel") {
    store.setCurrentTool("pokemon-wheel")
  }

  let wheel = store.getCurrentWheel()
  if (!wheel) {
    store.createNewWheel("pokemon-wheel", "Pokémon Wheel")
    wheel = store.getCurrentWheel()
  }
  if (!wheel) return false

  const ids = config.pokemon.map((p) => p.id)

  store.updateWheelData("pokemon-wheel", wheel.id, {
    ...(wheel.data as object),
    selectedGeneration: config.selectedGeneration,
    selectedPokemon: ids,
    displayMode: config.displayMode,
  })

  if (typeof window !== "undefined") {
    const path = window.location.pathname
    if (path === "/pokemon-picker-wheel") {
      const url = new URL(window.location.href)
      url.searchParams.set("template", config.templateParam)
      window.history.replaceState({}, "", `${url.pathname}${url.search}`)
    }
  }

  return true
}
