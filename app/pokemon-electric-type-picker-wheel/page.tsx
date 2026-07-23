import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("electric")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId="electric" />
}
