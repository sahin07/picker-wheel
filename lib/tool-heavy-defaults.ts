/**
 * Lazy-loaded default payloads for data-heavy tools.
 * Kept out of the home/picker-wheel critical path so First Load JS stays lean.
 */

export async function buildHeavyToolSeedData(
  toolType: string,
): Promise<Record<string, unknown> | null> {
  switch (toolType) {
    case "state-wheel": {
      const { getStatesByCountry } = await import("@/data/states")
      return {
        selectedCountry: "US",
        selectedStates: getStatesByCountry("US").slice(),
      }
    }
    case "country-wheel": {
      const { getCountriesByRegion } = await import("@/data/countries")
      return {
        selectedRegion: "all",
        selectedCountries: getCountriesByRegion("all"),
      }
    }
    case "mlb-wheel": {
      const { mlbTeams } = await import("@/data/mlb-teams")
      return { selectedLeague: "all", selectedTeams: mlbTeams }
    }
    case "nba-wheel": {
      const { nbaTeams } = await import("@/data/nba-teams")
      return { selectedConference: "all", selectedTeams: nbaTeams }
    }
    case "fortnite-wheel": {
      const {
        getAllFortniteSkins,
        getFortniteSkinCountsByRarity,
      } = await import("@/data/fortnite-skins")
      const allSkins = getAllFortniteSkins()
      return {
        selectedSkins: allSkins.map((skin) => skin.id),
        skinStats: { ...getFortniteSkinCountsByRarity() },
        aiRecommendations: allSkins
          .filter(
            (skin) =>
              skin.season.includes("Marvel") ||
              skin.season.includes("DC") ||
              skin.season.includes("Star Wars") ||
              skin.rarity === "Legendary" ||
              skin.rarity === "Mythic",
          )
          .slice(0, 6)
          .map((skin) => skin.id),
      }
    }
    case "pokemon-wheel": {
      const { pokemonData } = await import("@/data/pokemon-data")
      const allPokemon = Object.values(pokemonData).flat()
      const pokemonStats: Record<string, number> = {}
      Object.keys(pokemonData).forEach((generation) => {
        pokemonStats[generation] =
          pokemonData[generation as keyof typeof pokemonData].length
      })
      return {
        selectedPokemon: allPokemon.map((pokemon) => pokemon.id),
        pokemonStats,
        aiRecommendations: allPokemon
          .filter(
            (pokemon) =>
              pokemon.isLegendary ||
              pokemon.isStarter ||
              pokemon.popularity === "high",
          )
          .slice(0, 6)
          .map((pokemon) => pokemon.id),
      }
    }
    case "lol-wheel": {
      const { lolChampions } = await import("@/data/lol-champions")
      const allChampions = Object.values(lolChampions).flat()
      const allChampionIds = allChampions.map((champion) => champion.id)
      const championStats: Record<string, number> = {}
      Object.keys(lolChampions).forEach((role) => {
        championStats[role] = lolChampions[role as keyof typeof lolChampions].length
      })
      return {
        selectedChampions: allChampionIds,
        championOrder: allChampionIds,
        championStats,
        aiRecommendations: allChampions
          .filter(
            (champion) =>
              champion.popularity === "high" ||
              champion.isProPlay ||
              champion.role === "adc" ||
              champion.role === "mid",
          )
          .slice(0, 6)
          .map((champion) => champion.id),
      }
    }
    case "jjk-wheel": {
      const { jjkCharacters } = await import("@/data/jjk-characters")
      const characterIds = jjkCharacters.map((character) => character.id)
      return {
        selectedCharacters: characterIds,
        characterOrder: characterIds,
      }
    }
    case "demon-slayer-wheel": {
      const { demonSlayerCharacters } = await import(
        "@/data/demon-slayer-characters"
      )
      const characterIds = demonSlayerCharacters.map((character) => character.id)
      return {
        selectedCharacters: characterIds,
        characterOrder: characterIds,
      }
    }
    case "letter-picker-wheel": {
      const { ACHIEVEMENTS } = await import("@/lib/letter-picker-constants")
      return { achievements: [...ACHIEVEMENTS] }
    }
    default:
      return null
  }
}

/** True when a heavy list field is still empty and safe to hydrate. */
export function needsHeavyDefaultHydration(
  toolType: string,
  data: Record<string, unknown> | null | undefined,
): boolean {
  if (!data) return false
  switch (toolType) {
    case "state-wheel":
      return !Array.isArray(data.selectedStates) || data.selectedStates.length === 0
    case "country-wheel":
      return (
        !Array.isArray(data.selectedCountries) ||
        data.selectedCountries.length === 0
      )
    case "mlb-wheel":
    case "nba-wheel":
      return !Array.isArray(data.selectedTeams) || data.selectedTeams.length === 0
    case "fortnite-wheel":
      return !Array.isArray(data.selectedSkins) || data.selectedSkins.length === 0
    case "pokemon-wheel":
      return (
        !Array.isArray(data.selectedPokemon) || data.selectedPokemon.length === 0
      )
    case "lol-wheel":
      return (
        !Array.isArray(data.selectedChampions) ||
        data.selectedChampions.length === 0
      )
    case "jjk-wheel":
    case "demon-slayer-wheel":
      return (
        !Array.isArray(data.selectedCharacters) ||
        data.selectedCharacters.length === 0
      )
    case "letter-picker-wheel":
      return !Array.isArray(data.achievements) || data.achievements.length === 0
    default:
      return false
  }
}
