import CountryWheelSpokeRoute, {
  countryWheelSpokeMetadata,
} from "@/components/country-wheel/country-wheel-spoke-route"

export const metadata = countryWheelSpokeMetadata("travel")

export default function Page() {
  return <CountryWheelSpokeRoute spokeId={"travel"} />
}
