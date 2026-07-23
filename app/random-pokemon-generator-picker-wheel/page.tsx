import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("all")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId="all" />
}
