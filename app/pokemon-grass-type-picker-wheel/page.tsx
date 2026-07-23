import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("grass")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId="grass" />
}
