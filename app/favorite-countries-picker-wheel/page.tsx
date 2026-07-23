import CountryWheelSpokeRoute, {
  countryWheelSpokeMetadata,
} from "@/components/country-wheel/country-wheel-spoke-route"

export const metadata = countryWheelSpokeMetadata("favorites")

export default function Page() {
  return <CountryWheelSpokeRoute spokeId={"favorites"} />
}
