import CountryWheelSpokeRoute, {
  countryWheelSpokeMetadata,
} from "@/components/country-wheel/country-wheel-spoke-route"

export const metadata = countryWheelSpokeMetadata("g20")

export default function Page() {
  return <CountryWheelSpokeRoute spokeId={"g20"} />
}
