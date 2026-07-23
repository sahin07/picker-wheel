import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("fire")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId="fire" />
}
