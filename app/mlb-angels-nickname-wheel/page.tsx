import MlbAngelsSpokeRoute, { mlbAngelsSpokeMetadata } from "@/components/mlb-angels/mlb-angels-spoke-route"

export const metadata = mlbAngelsSpokeMetadata("angels-nickname")

export default function Page() {
  return <MlbAngelsSpokeRoute spokeId="angels-nickname" />
}
