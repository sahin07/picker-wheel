import HomeSpokeRoute, {
  homeSpokeMetadata,
} from "@/components/home/home-spoke-route"

export const metadata = homeSpokeMetadata("giveaway")

export default function Page() {
  return <HomeSpokeRoute spokeId="giveaway" />
}
