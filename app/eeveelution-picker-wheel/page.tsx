import PokemonWheelSpokeRoute, {
  pokemonWheelSpokeMetadata,
} from "@/components/pokemon-wheel/pokemon-wheel-spoke-route"

export const metadata = pokemonWheelSpokeMetadata("eeveelutions")

export default function Page() {
  return <PokemonWheelSpokeRoute spokeId={"eeveelutions"} />
}
