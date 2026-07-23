import LolWheelSpokeRoute, {
  lolWheelSpokeMetadata,
} from "@/components/lol-wheel/lol-wheel-spoke-route"

export const metadata = lolWheelSpokeMetadata("mage")

export default function Page() {
  return <LolWheelSpokeRoute spokeId={"mage"} />
}
