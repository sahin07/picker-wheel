import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("legendaries")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId="legendaries" />
}
