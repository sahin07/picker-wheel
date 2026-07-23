import CountryWheelSpokeRoute, {
  countryWheelSpokeMetadata,
} from "@/components/country-wheel/country-wheel-spoke-route"

export const metadata = countryWheelSpokeMetadata("south-america")

export default function Page() {
  return <CountryWheelSpokeRoute spokeId={"south-america"} />
}
