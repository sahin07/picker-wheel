import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("gen4")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId="gen4" />
}
