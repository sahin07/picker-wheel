import HomeSpokeRoute, {
  homeSpokeMetadata,
} from "@/components/home/home-spoke-route"

export const metadata = homeSpokeMetadata("secret-santa")

export default function Page() {
  return <HomeSpokeRoute spokeId="secret-santa" />
}
