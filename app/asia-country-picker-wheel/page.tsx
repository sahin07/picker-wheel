import CountryWheelSpokeRoute, {
  countryWheelSpokeMetadata,
} from "@/components/country-wheel/country-wheel-spoke-route"

export const metadata = countryWheelSpokeMetadata("asia")

export default function Page() {
  return <CountryWheelSpokeRoute spokeId={"asia"} />
}
